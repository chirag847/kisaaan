import express, { Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Grain from '../models/Grain';
import User from '../models/User';
import { authenticateToken, AuthRequest, requireRole } from '../middleware/auth';

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/grains');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `grain-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed'));
    }
  }
});

// Get all grains with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('grainType').optional().isString(),
  query('location').optional().isString(),
  query('quality').optional().isIn(['Premium', 'Good', 'Standard']),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('organicOnly').optional().isBoolean()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = { status: 'available', availableQuantity: { $gt: 0 } };

    if (req.query.grainType) {
      filter.grainType = req.query.grainType;
    }
    if (req.query.location) {
      filter.location = new RegExp(req.query.location as string, 'i');
    }
    if (req.query.quality) {
      filter.quality = req.query.quality;
    }
    if (req.query.minPrice || req.query.maxPrice) {
      filter.pricePerQuintal = {};
      if (req.query.minPrice) filter.pricePerQuintal.$gte = parseFloat(req.query.minPrice as string);
      if (req.query.maxPrice) filter.pricePerQuintal.$lte = parseFloat(req.query.maxPrice as string);
    }
    if (req.query.organicOnly === 'true') {
      filter.organicCertified = true;
    }

    const grains = await Grain.find(filter)
      .populate('farmerId', 'name email phone verified')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Grain.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      grains,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get grains error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get grain by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const grain = await Grain.findById(req.params.id)
      .populate('farmerId', 'name email phone address verified');

    if (!grain) {
      return res.status(404).json({ message: 'Grain not found' });
    }

    res.json(grain);
  } catch (error) {
    console.error('Get grain error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new grain listing (farmers only)
router.post('/', authenticateToken, requireRole(['farmer']), [
  body('grainType').notEmpty().withMessage('Grain type is required'),
  body('quantity').isFloat({ min: 0.1 }).withMessage('Quantity must be at least 0.1 quintal'),
  body('pricePerQuintal').isFloat({ min: 1 }).withMessage('Price must be greater than 0'),
  body('quality').isIn(['Premium', 'Good', 'Standard']).withMessage('Quality must be Premium, Good, or Standard'),
  body('description').isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('location').notEmpty().withMessage('Location is required'),
  body('harvestDate').isISO8601().withMessage('Valid harvest date required'),
  body('moistureContent').optional().isFloat({ min: 0, max: 100 }),
  body('organicCertified').optional().isBoolean()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'At least one sample image is required' });
    }

    const sampleImages = files.map(file => `/uploads/grains/${file.filename}`);

    const {
      grainType,
      quantity,
      pricePerQuintal,
      quality,
      description,
      location,
      harvestDate,
      moistureContent,
      organicCertified
    } = req.body;

    const grain = new Grain({
      farmerId: req.user._id,
      grainType,
      quantity: parseFloat(quantity),
      pricePerQuintal: parseFloat(pricePerQuintal),
      quality,
      description,
      sampleImages,
      location,
      harvestDate: new Date(harvestDate),
      moistureContent: moistureContent ? parseFloat(moistureContent) : undefined,
      organicCertified: organicCertified === 'true',
      availableQuantity: parseFloat(quantity)
    });

    await grain.save();
    await grain.populate('farmerId', 'name email phone verified');

    res.status(201).json({
      message: 'Grain listing created successfully',
      grain
    });
  } catch (error) {
    console.error('Create grain error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update grain listing (farmer only, own grains)
router.put('/:id', authenticateToken, requireRole(['farmer']), [
  body('quantity').optional().isFloat({ min: 0.1 }),
  body('pricePerQuintal').optional().isFloat({ min: 1 }),
  body('quality').optional().isIn(['Premium', 'Good', 'Standard']),
  body('description').optional().isLength({ min: 10, max: 1000 }),
  body('location').optional().notEmpty(),
  body('moistureContent').optional().isFloat({ min: 0, max: 100 }),
  body('organicCertified').optional().isBoolean()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const grain = await Grain.findOne({
      _id: req.params.id,
      farmerId: req.user._id
    });

    if (!grain) {
      return res.status(404).json({ message: 'Grain not found or unauthorized' });
    }

    const updates: any = {};
    const allowedUpdates = [
      'quantity', 'pricePerQuintal', 'quality', 'description', 
      'location', 'moistureContent', 'organicCertified'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // If quantity is updated, update available quantity too
    if (updates.quantity) {
      updates.availableQuantity = updates.quantity;
    }

    const updatedGrain = await Grain.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).populate('farmerId', 'name email phone verified');

    res.json({
      message: 'Grain listing updated successfully',
      grain: updatedGrain
    });
  } catch (error) {
    console.error('Update grain error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete grain listing (farmer only, own grains)
router.delete('/:id', authenticateToken, requireRole(['farmer']), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const grain = await Grain.findOne({
      _id: req.params.id,
      farmerId: req.user._id
    });

    if (!grain) {
      return res.status(404).json({ message: 'Grain not found or unauthorized' });
    }

    // Delete associated image files
    grain.sampleImages.forEach(imagePath => {
      const fullPath = path.join(__dirname, '../../', imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    await Grain.findByIdAndDelete(req.params.id);

    res.json({ message: 'Grain listing deleted successfully' });
  } catch (error) {
    console.error('Delete grain error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get farmer's own grains
router.get('/farmer/my-grains', authenticateToken, requireRole(['farmer']), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const grains = await Grain.find({ farmerId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(grains);
  } catch (error) {
    console.error('Get farmer grains error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;

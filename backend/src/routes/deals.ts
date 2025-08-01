import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Deal from '../models/Deal';
import Grain from '../models/Grain';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Create a new deal
router.post('/', authenticateToken, [
  body('grainId').isMongoId().withMessage('Valid grain ID required'),
  body('quantity').isFloat({ min: 0.1 }).withMessage('Quantity must be at least 0.1 quintal'),
  body('agreedPrice').isFloat({ min: 1 }).withMessage('Agreed price must be greater than 0'),
  body('deliveryAddress').optional().isLength({ max: 500 }),
  body('notes').optional().isLength({ max: 1000 })
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

    const { grainId, quantity, agreedPrice, deliveryAddress, notes } = req.body;

    // Check if grain exists and is available
    const grain = await Grain.findById(grainId);
    if (!grain) {
      return res.status(404).json({ message: 'Grain not found' });
    }

    if (grain.status !== 'available') {
      return res.status(400).json({ message: 'Grain is not available' });
    }

    if (quantity > grain.availableQuantity) {
      return res.status(400).json({ 
        message: `Requested quantity exceeds available quantity (${grain.availableQuantity} quintals)` 
      });
    }

    // Prevent farmers from buying their own grains
    if (grain.farmerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot buy your own grain' });
    }

    const totalAmount = quantity * agreedPrice;

    const deal = new Deal({
      grainId,
      farmerId: grain.farmerId,
      buyerId: req.user._id,
      quantity,
      agreedPrice,
      totalAmount,
      deliveryAddress,
      notes
    });

    await deal.save();
    await deal.populate([
      { path: 'grainId', select: 'grainType quality location' },
      { path: 'farmerId', select: 'name email phone' },
      { path: 'buyerId', select: 'name email phone' }
    ]);

    res.status(201).json({
      message: 'Deal created successfully',
      deal
    });
  } catch (error) {
    console.error('Create deal error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's deals
router.get('/my-deals', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const filter = req.user.role === 'farmer' 
      ? { farmerId: req.user._id }
      : { buyerId: req.user._id };

    const deals = await Deal.find(filter)
      .populate([
        { path: 'grainId', select: 'grainType quality location sampleImages' },
        { path: 'farmerId', select: 'name email phone' },
        { path: 'buyerId', select: 'name email phone' }
      ])
      .sort({ createdAt: -1 });

    res.json(deals);
  } catch (error) {
    console.error('Get deals error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update deal status
router.put('/:id/status', authenticateToken, [
  body('status').isIn(['negotiating', 'agreed', 'payment_pending', 'paid', 'completed', 'cancelled'])
    .withMessage('Invalid status'),
  body('deliveryDate').optional().isISO8601()
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

    const { status, deliveryDate } = req.body;
    const dealId = req.params.id;

    const deal = await Deal.findById(dealId);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Check if user is part of this deal
    const isAuthorized = deal.farmerId.toString() === req.user._id.toString() ||
                        deal.buyerId.toString() === req.user._id.toString();

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Unauthorized to modify this deal' });
    }

    const updateData: any = { status };
    if (deliveryDate) {
      updateData.deliveryDate = new Date(deliveryDate);
    }

    const updatedDeal = await Deal.findByIdAndUpdate(
      dealId,
      updateData,
      { new: true }
    ).populate([
      { path: 'grainId', select: 'grainType quality location' },
      { path: 'farmerId', select: 'name email phone' },
      { path: 'buyerId', select: 'name email phone' }
    ]);

    // If deal is completed or cancelled, update grain availability
    if (status === 'completed') {
      await Grain.findByIdAndUpdate(deal.grainId, {
        $inc: { availableQuantity: -deal.quantity }
      });
    } else if (status === 'cancelled') {
      // If deal was previously agreed/paid, restore availability
      if (['agreed', 'payment_pending', 'paid'].includes(deal.status)) {
        await Grain.findByIdAndUpdate(deal.grainId, {
          $inc: { availableQuantity: deal.quantity }
        });
      }
    }

    res.json({
      message: 'Deal status updated successfully',
      deal: updatedDeal
    });
  } catch (error) {
    console.error('Update deal status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get deal by ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const deal = await Deal.findById(req.params.id)
      .populate([
        { path: 'grainId', select: 'grainType quality location sampleImages description' },
        { path: 'farmerId', select: 'name email phone address' },
        { path: 'buyerId', select: 'name email phone address' }
      ]);

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Check if user is part of this deal
    const isAuthorized = deal.farmerId._id.toString() === req.user._id.toString() ||
                        deal.buyerId._id.toString() === req.user._id.toString();

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Unauthorized to view this deal' });
    }

    res.json(deal);
  } catch (error) {
    console.error('Get deal error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;

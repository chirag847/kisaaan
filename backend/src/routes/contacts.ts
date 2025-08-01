import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Contact from '../models/Contact';
import Grain from '../models/Grain';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Send contact message
router.post('/', authenticateToken, [
  body('grainId').isMongoId().withMessage('Valid grain ID required'),
  body('subject').isLength({ min: 5, max: 200 }).withMessage('Subject must be 5-200 characters'),
  body('message').isLength({ min: 10, max: 2000 }).withMessage('Message must be 10-2000 characters'),
  body('contactInfo.email').isEmail().withMessage('Valid email required'),
  body('contactInfo.phone').matches(/^[+]?[\d\s-()]+$/).withMessage('Valid phone number required')
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

    const { grainId, subject, message, contactInfo } = req.body;

    // Check if grain exists
    const grain = await Grain.findById(grainId);
    if (!grain) {
      return res.status(404).json({ message: 'Grain not found' });
    }

    // Prevent sending messages to yourself
    if (grain.farmerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot send a message to yourself' });
    }

    const contact = new Contact({
      grainId,
      fromUserId: req.user._id,
      toUserId: grain.farmerId,
      subject,
      message,
      contactInfo
    });

    await contact.save();
    await contact.populate([
      { path: 'grainId', select: 'grainType location' },
      { path: 'fromUserId', select: 'name email role' },
      { path: 'toUserId', select: 'name email role' }
    ]);

    res.status(201).json({
      message: 'Contact message sent successfully',
      contact
    });
  } catch (error) {
    console.error('Send contact error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get received messages
router.get('/received', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const contacts = await Contact.find({ toUserId: req.user._id })
      .populate([
        { path: 'grainId', select: 'grainType location sampleImages' },
        { path: 'fromUserId', select: 'name email role' }
      ])
      .sort({ createdAt: -1 });

    res.json(contacts);
  } catch (error) {
    console.error('Get received contacts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get sent messages
router.get('/sent', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const contacts = await Contact.find({ fromUserId: req.user._id })
      .populate([
        { path: 'grainId', select: 'grainType location sampleImages' },
        { path: 'toUserId', select: 'name email role' }
      ])
      .sort({ createdAt: -1 });

    res.json(contacts);
  } catch (error) {
    console.error('Get sent contacts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Mark message as read
router.put('/:id/read', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const contact = await Contact.findOne({
      _id: req.params.id,
      toUserId: req.user._id
    });

    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    contact.read = true;
    await contact.save();

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get unread message count
router.get('/unread-count', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const count = await Contact.countDocuments({
      toUserId: req.user._id,
      read: false
    });

    res.json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;

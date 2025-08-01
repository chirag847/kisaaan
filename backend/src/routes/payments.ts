import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Deal from '../models/Deal';
import { authenticateToken, AuthRequest } from '../middleware/auth';

interface PopulatedDeal {
  _id: string;
  grainId: {
    _id: string;
    type: string;
  };
  farmerId: {
    _id: string;
    name: string;
  };
  buyerId: {
    _id: string;
    name: string;
  };
  quantity: number;
  agreedPrice: number;
  status: string;
  paymentId?: string;
}

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'your_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret'
});

// Create payment order
router.post('/create-order', authenticateToken, [
  body('dealId').isMongoId().withMessage('Valid deal ID required'),
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0')
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

    const { dealId, amount } = req.body;

    // Verify deal exists and user is the buyer
    const deal = await Deal.findById(dealId)
      .populate('grainId')
      .populate('farmerId', 'name')
      .populate('buyerId', 'name');

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    if (deal.buyerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized - only buyer can make payment' });
    }

    if (deal.status !== 'agreed') {
      return res.status(400).json({ message: 'Deal must be agreed before payment' });
    }

    const options = {
      amount: Math.round(amount * 100), // Amount in paisa
      currency: 'INR',
      receipt: `deal_${dealId}_${Date.now()}`,
      notes: {
        dealId: dealId,
        buyerId: req.user._id.toString(),
        grainType: (deal.grainId as any).type,
        quantity: deal.quantity.toString()
      }
    };

    const order = await razorpay.orders.create(options);

    // Update deal status
    await Deal.findByIdAndUpdate(dealId, {
      status: 'payment_pending',
      paymentId: order.id
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      dealId: dealId,
      buyerName: (deal.buyerId as any).name,
      farmerName: (deal.farmerId as any).name,
      grainDetails: {
        type: (deal.grainId as any).type,
        quantity: deal.quantity,
        price: deal.agreedPrice
      }
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Verify payment
router.post('/verify', authenticateToken, [
  body('razorpay_order_id').notEmpty().withMessage('Order ID required'),
  body('razorpay_payment_id').notEmpty().withMessage('Payment ID required'),
  body('razorpay_signature').notEmpty().withMessage('Signature required'),
  body('dealId').isMongoId().withMessage('Valid deal ID required')
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

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dealId
    } = req.body;

    // Verify signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'your_key_secret';
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Verify deal and update status
    const deal = await Deal.findById(dealId);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    if (deal.buyerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update deal with payment information
    await Deal.findByIdAndUpdate(dealId, {
      status: 'paid',
      paymentId: razorpay_payment_id
    });

    res.json({
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
      status: 'paid'
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get payment details
router.get('/payment/:paymentId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const paymentId = req.params.paymentId;

    // Find deal with this payment ID
    const deal = await Deal.findOne({ paymentId })
      .populate('grainId', 'grainType')
      .populate('farmerId', 'name email')
      .populate('buyerId', 'name email');

    if (!deal) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check if user is authorized to view this payment
    const isAuthorized = deal.farmerId._id.toString() === req.user._id.toString() ||
                        deal.buyerId._id.toString() === req.user._id.toString();

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Unauthorized to view this payment' });
    }

    try {
      // Fetch payment details from Razorpay
      const payment = await razorpay.payments.fetch(paymentId);
      
      res.json({
        deal,
        payment: {
          id: payment.id,
          amount: Number(payment.amount) / 100, // Convert from paisa to rupees
          currency: payment.currency,
          status: payment.status,
          method: payment.method,
          createdAt: new Date(payment.created_at * 1000),
          description: payment.description
        }
      });
    } catch (razorpayError) {
      // If Razorpay API fails, still return deal information
      res.json({
        deal,
        payment: {
          id: paymentId,
          status: 'unknown',
          message: 'Payment details unavailable'
        }
      });
    }
  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;

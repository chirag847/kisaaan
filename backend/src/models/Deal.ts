import mongoose, { Schema, Document } from 'mongoose';

export interface IDeal extends Document {
  grainId: mongoose.Types.ObjectId;
  farmerId: mongoose.Types.ObjectId;
  buyerId: mongoose.Types.ObjectId;
  quantity: number;
  agreedPrice: number;
  totalAmount: number;
  status: 'negotiating' | 'agreed' | 'payment_pending' | 'paid' | 'completed' | 'cancelled';
  deliveryDate?: Date;
  deliveryAddress?: string;
  paymentId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const dealSchema = new Schema<IDeal>({
  grainId: {
    type: Schema.Types.ObjectId,
    ref: 'Grain',
    required: [true, 'Grain ID is required']
  },
  farmerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Farmer ID is required']
  },
  buyerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Buyer ID is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0.1, 'Quantity must be at least 0.1 quintal']
  },
  agreedPrice: {
    type: Number,
    required: [true, 'Agreed price is required'],
    min: [1, 'Price must be greater than 0']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [1, 'Total amount must be greater than 0']
  },
  status: {
    type: String,
    enum: ['negotiating', 'agreed', 'payment_pending', 'paid', 'completed', 'cancelled'],
    default: 'negotiating'
  },
  deliveryDate: {
    type: Date
  },
  deliveryAddress: {
    type: String,
    maxlength: [500, 'Delivery address cannot exceed 500 characters']
  },
  paymentId: {
    type: String
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Indexes
dealSchema.index({ farmerId: 1, status: 1 });
dealSchema.index({ buyerId: 1, status: 1 });
dealSchema.index({ grainId: 1 });
dealSchema.index({ createdAt: -1 });

export default mongoose.model<IDeal>('Deal', dealSchema);

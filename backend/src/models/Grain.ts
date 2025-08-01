import mongoose, { Schema, Document } from 'mongoose';

export interface IGrain extends Document {
  farmerId: mongoose.Types.ObjectId;
  grainType: string;
  quantity: number;
  pricePerQuintal: number;
  quality: 'Premium' | 'Good' | 'Standard';
  description: string;
  sampleImages: string[];
  location: string;
  harvestDate: Date;
  moistureContent?: number;
  organicCertified: boolean;
  availableQuantity: number;
  status: 'available' | 'sold' | 'reserved';
  createdAt: Date;
  updatedAt: Date;
}

const grainSchema = new Schema<IGrain>({
  farmerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Farmer ID is required']
  },
  grainType: {
    type: String,
    required: [true, 'Grain type is required'],
    enum: [
      'Wheat', 'Rice', 'Corn', 'Barley', 'Oats', 'Rye', 'Sorghum', 
      'Millet', 'Quinoa', 'Buckwheat', 'Soybeans', 'Lentils', 
      'Chickpeas', 'Black Beans', 'Kidney Beans', 'Other'
    ]
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0.1, 'Quantity must be at least 0.1 quintal']
  },
  pricePerQuintal: {
    type: Number,
    required: [true, 'Price per quintal is required'],
    min: [1, 'Price must be greater than 0']
  },
  quality: {
    type: String,
    enum: ['Premium', 'Good', 'Standard'],
    required: [true, 'Quality is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  sampleImages: [{
    type: String,
    required: true
  }],
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  harvestDate: {
    type: Date,
    required: [true, 'Harvest date is required']
  },
  moistureContent: {
    type: Number,
    min: [0, 'Moisture content cannot be negative'],
    max: [100, 'Moisture content cannot exceed 100%']
  },
  organicCertified: {
    type: Boolean,
    default: false
  },
  availableQuantity: {
    type: Number,
    required: [true, 'Available quantity is required'],
    min: [0, 'Available quantity cannot be negative']
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'reserved'],
    default: 'available'
  }
}, {
  timestamps: true
});

// Index for efficient searching
grainSchema.index({ grainType: 1, location: 1, status: 1 });
grainSchema.index({ farmerId: 1 });
grainSchema.index({ pricePerQuintal: 1 });
grainSchema.index({ createdAt: -1 });

export default mongoose.model<IGrain>('Grain', grainSchema);

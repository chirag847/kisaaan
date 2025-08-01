import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  grainId: mongoose.Types.ObjectId;
  fromUserId: mongoose.Types.ObjectId;
  toUserId: mongoose.Types.ObjectId;
  subject: string;
  message: string;
  contactInfo: {
    email: string;
    phone: string;
  };
  read: boolean;
  replied: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>({
  grainId: {
    type: Schema.Types.ObjectId,
    ref: 'Grain',
    required: [true, 'Grain ID is required']
  },
  fromUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'From user ID is required']
  },
  toUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'To user ID is required']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  contactInfo: {
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[+]?[\d\s-()]+$/, 'Please enter a valid phone number']
    }
  },
  read: {
    type: Boolean,
    default: false
  },
  replied: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
contactSchema.index({ toUserId: 1, read: 1 });
contactSchema.index({ fromUserId: 1 });
contactSchema.index({ grainId: 1 });
contactSchema.index({ createdAt: -1 });

export default mongoose.model<IContact>('Contact', contactSchema);

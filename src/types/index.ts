export interface Grain {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerEmail: string;
  farmerPhone: string;
  grainType: string;
  quantity: number; // in quintals
  pricePerQuintal: number;
  quality: 'Premium' | 'Good' | 'Standard';
  description: string;
  sampleImages: string[];
  location: string;
  harvestDate: string;
  moistureContent?: number;
  organicCertified: boolean;
  availableQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Farmer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  farmSize: number; // in acres
  specializations: string[];
  verified: boolean;
  rating: number;
  joinedDate: string;
}

export interface Buyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  businessType: string;
  verified: boolean;
  rating: number;
  joinedDate: string;
}

export interface Deal {
  id: string;
  grainId: string;
  farmerId: string;
  buyerId: string;
  quantity: number;
  agreedPrice: number;
  totalAmount: number;
  status: 'negotiating' | 'agreed' | 'payment_pending' | 'paid' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  deliveryDate?: string;
  deliveryAddress?: string;
  paymentId?: string;
}

export interface ContactRequest {
  id: string;
  grainId: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  contactInfo: {
    email: string;
    phone: string;
  };
  createdAt: string;
  read: boolean;
}

export type UserRole = 'farmer' | 'buyer';

export interface User {
  id: string;
  role: UserRole;
  profile: Farmer | Buyer;
}

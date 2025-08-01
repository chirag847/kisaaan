import api from './api';

export interface Grain {
  _id: string;
  name: string;
  variety: string;
  quality: string;
  quantity: number;
  unit: 'kg' | 'quintal' | 'ton';
  pricePerUnit: number;
  description: string;
  location: string;
  farmer: {
    _id: string;
    name: string;
    phone: string;
    location?: string;
  };
  images: string[];
  sampleRequested: boolean;
  status: 'available' | 'sold' | 'pending';
  harvestDate: string;
  expiryDate?: string;
  certifications: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GrainFilters {
  search?: string;
  quality?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GrainsResponse {
  grains: Grain[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CreateGrainData {
  name: string;
  variety: string;
  quality: string;
  quantity: number;
  unit: 'kg' | 'quintal' | 'ton';
  pricePerUnit: number;
  description: string;
  location: string;
  harvestDate: string;
  expiryDate?: string;
  certifications?: string[];
}

export const grainsService = {
  async getGrains(filters?: GrainFilters): Promise<GrainsResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get(`/grains?${params.toString()}`);
    return response.data;
  },

  async getGrainById(id: string): Promise<Grain> {
    const response = await api.get(`/grains/${id}`);
    return response.data.grain;
  },

  async createGrain(data: CreateGrainData, images?: File[]): Promise<Grain> {
    const formData = new FormData();
    
    // Append grain data
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => formData.append(key, item));
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    
    // Append images
    if (images && images.length > 0) {
      images.forEach(image => {
        formData.append('images', image);
      });
    }
    
    const response = await api.post('/grains', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.grain;
  },

  async updateGrain(id: string, data: Partial<CreateGrainData>): Promise<Grain> {
    const response = await api.put(`/grains/${id}`, data);
    return response.data.grain;
  },

  async deleteGrain(id: string): Promise<void> {
    await api.delete(`/grains/${id}`);
  },

  async getFarmerGrains(): Promise<Grain[]> {
    const response = await api.get('/grains/farmer/my-grains');
    return response.data.grains;
  },

  async requestSample(grainId: string): Promise<void> {
    await api.post(`/grains/${grainId}/request-sample`);
  },
};

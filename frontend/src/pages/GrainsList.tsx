import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Eye, Wheat, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

interface Grain {
  _id: string;
  type: string;
  variety: string;
  quantity: number;
  pricePerQuintal: number;
  qualityGrade: string;
  description: string;
  images: string[];
  location: string;
  harvestDate: string;
  farmer: {
    _id: string;
    name: string;
    rating?: number;
  };
  isAvailable: boolean;
  createdAt: string;
}

const GrainsList: React.FC = () => {
  const [grains, setGrains] = useState<Grain[]>([]);
  const [filteredGrains, setFilteredGrains] = useState<Grain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    qualityGrade: '',
    priceRange: '',
    location: ''
  });

  useEffect(() => {
    fetchGrains();
  }, []);

  const fetchGrains = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3001/api/grains');
      
      if (response.ok) {
        const data = await response.json();
        setGrains(data);
      } else {
        toast.error('Failed to fetch grains');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      console.error('Fetch grains error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterGrains = useCallback(() => {
    let filtered = grains.filter(grain => grain.isAvailable);

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(grain =>
        grain.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grain.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grain.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grain.farmer.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter(grain => grain.type === filters.type);
    }

    // Quality grade filter
    if (filters.qualityGrade) {
      filtered = filtered.filter(grain => grain.qualityGrade === filters.qualityGrade);
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(grain => {
        if (max) {
          return grain.pricePerQuintal >= min && grain.pricePerQuintal <= max;
        }
        return grain.pricePerQuintal >= min;
      });
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(grain =>
        grain.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredGrains(filtered);
  }, [grains, searchTerm, filters]);

  useEffect(() => {
    filterGrains();
  }, [filterGrains]);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      qualityGrade: '',
      priceRange: '',
      location: ''
    });
    setSearchTerm('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getQualityColor = (grade: string) => {
    switch (grade) {
      case 'Premium': return 'text-green-600 bg-green-100';
      case 'Grade A': return 'text-blue-600 bg-blue-100';
      case 'Grade B': return 'text-yellow-600 bg-yellow-100';
      case 'Grade C': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-primary-600">Loading grains...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-800 mb-2">Browse Grains</h1>
          <p className="text-primary-600">
            Discover fresh, quality grains directly from farmers across the country.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-400" />
                <input
                  type="text"
                  placeholder="Search grains, variety, farmer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-primary-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Types</option>
                <option value="Wheat">Wheat</option>
                <option value="Rice">Rice</option>
                <option value="Barley">Barley</option>
                <option value="Corn">Corn</option>
                <option value="Millet">Millet</option>
              </select>
            </div>

            {/* Quality Filter */}
            <div>
              <select
                value={filters.qualityGrade}
                onChange={(e) => handleFilterChange('qualityGrade', e.target.value)}
                className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Grades</option>
                <option value="Premium">Premium</option>
                <option value="Grade A">Grade A</option>
                <option value="Grade B">Grade B</option>
                <option value="Grade C">Grade C</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Prices</option>
                <option value="0-2000">₹0 - ₹2,000</option>
                <option value="2000-3000">₹2,000 - ₹3,000</option>
                <option value="3000-4000">₹3,000 - ₹4,000</option>
                <option value="4000-5000">₹4,000 - ₹5,000</option>
                <option value="5000">₹5,000+</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div>
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-primary-600">
            Showing {filteredGrains.length} of {grains.length} grains
          </p>
        </div>

        {/* Grains Grid */}
        {filteredGrains.length === 0 ? (
          <div className="text-center py-12">
            <Wheat className="h-16 w-16 text-primary-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-primary-600 mb-2">No grains found</h3>
            <p className="text-primary-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGrains.map((grain) => (
              <div key={grain._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="aspect-video bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
                  {grain.images && grain.images.length > 0 ? (
                    <img
                      src={grain.images[0]}
                      alt={`${grain.type} - ${grain.variety}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Wheat className="h-16 w-16 text-yellow-600" />
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-primary-800">
                        {grain.type} - {grain.variety}
                      </h3>
                      <p className="text-sm text-primary-600">by {grain.farmer.name}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(grain.qualityGrade)}`}>
                      {grain.qualityGrade}
                    </span>
                  </div>

                  <p className="text-primary-600 text-sm mb-4 line-clamp-2">
                    {grain.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-primary-500">Quantity:</span>
                      <span className="text-sm font-medium">{grain.quantity} quintals</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-primary-500">Price:</span>
                      <span className="text-lg font-bold text-secondary-600">
                        ₹{grain.pricePerQuintal.toLocaleString()}/quintal
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-primary-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{grain.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Harvested {formatDate(grain.harvestDate)}</span>
                    </div>
                  </div>

                  {grain.farmer.rating && (
                    <div className="flex items-center space-x-1 mb-4">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{grain.farmer.rating}</span>
                      <span className="text-xs text-primary-500">farmer rating</span>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Link
                      to={`/grains/${grain._id}`}
                      className="flex-1 bg-primary-600 text-white text-center py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                      View Details
                    </Link>
                    <button className="px-3 py-2 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors">
                      <Eye className="h-4 w-4 text-primary-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GrainsList;

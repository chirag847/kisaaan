import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Wheat, 
  TrendingUp, 
  Users, 
  Package, 
  Calendar,
  MapPin,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'farmer' | 'buyer';
}

interface Grain {
  _id: string;
  type: string;
  variety: string;
  quantity: number;
  pricePerQuintal: number;
  qualityGrade: string;
  location: string;
  isAvailable: boolean;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [grains, setGrains] = useState<Grain[]>([]);
  const [stats, setStats] = useState({
    totalGrains: 0,
    totalValue: 0,
    activeListings: 0,
    totalViews: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please log in to view dashboard');
        return;
      }

      // Fetch user's grains (for farmers)
      const response = await fetch('http://localhost:3001/api/grains/my-grains', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setGrains(data);
        
        // Calculate stats
        const totalValue = data.reduce((sum: number, grain: Grain) => 
          sum + (grain.quantity * grain.pricePerQuintal), 0);
        const activeListings = data.filter((grain: Grain) => grain.isAvailable).length;
        
        setStats({
          totalGrains: data.length,
          totalValue,
          activeListings,
          totalViews: 0 // This would come from backend analytics
        });
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGrain = async (grainId: string) => {
    if (!window.confirm('Are you sure you want to delete this grain listing?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/grains/${grainId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Grain listing deleted successfully');
        fetchDashboardData();
      } else {
        toast.error('Failed to delete grain listing');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    }
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
          <p className="text-primary-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-800 mb-4">Access Denied</h2>
          <p className="text-primary-600 mb-4">Please log in to view your dashboard.</p>
          <Link
            to="/login"
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-800 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-primary-600">
            {user.role === 'farmer' ? 'Manage your grain listings and track performance' : 'Browse and purchase grains from verified farmers'}
          </p>
        </div>

        {user.role === 'farmer' ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Package className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-primary-600">Total Listings</p>
                    <p className="text-2xl font-bold text-primary-800">{stats.totalGrains}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-2 bg-secondary-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-secondary-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-primary-600">Total Value</p>
                    <p className="text-2xl font-bold text-primary-800">
                      ₹{stats.totalValue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-2 bg-accent-100 rounded-lg">
                    <Wheat className="h-6 w-6 text-accent-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-primary-600">Active Listings</p>
                    <p className="text-2xl font-bold text-primary-800">{stats.activeListings}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Eye className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-primary-600">Total Views</p>
                    <p className="text-2xl font-bold text-primary-800">{stats.totalViews}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                to="/add-grain"
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center justify-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Grain
              </Link>
              <Link
                to="/grains"
                className="border border-primary-600 text-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors font-medium text-center"
              >
                Browse All Grains
              </Link>
            </div>

            {/* Grain Listings */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-primary-200">
                <h2 className="text-xl font-semibold text-primary-800">Your Grain Listings</h2>
              </div>
              
              {grains.length === 0 ? (
                <div className="p-12 text-center">
                  <Wheat className="h-16 w-16 text-primary-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-primary-600 mb-2">No grain listings yet</h3>
                  <p className="text-primary-500 mb-4">Start by adding your first grain listing</p>
                  <Link
                    to="/add-grain"
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Add Grain
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-primary-200">
                  {grains.map((grain) => (
                    <div key={grain._id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-primary-800">
                              {grain.type} - {grain.variety}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(grain.qualityGrade)}`}>
                              {grain.qualityGrade}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              grain.isAvailable 
                                ? 'text-green-600 bg-green-100' 
                                : 'text-red-600 bg-red-100'
                            }`}>
                              {grain.isAvailable ? 'Available' : 'Sold'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-primary-500">Quantity:</span>
                              <div className="font-medium">{grain.quantity} quintals</div>
                            </div>
                            <div>
                              <span className="text-primary-500">Price:</span>
                              <div className="font-medium text-secondary-600">
                                ₹{grain.pricePerQuintal.toLocaleString()}/quintal
                              </div>
                            </div>
                            <div>
                              <span className="text-primary-500">Location:</span>
                              <div className="font-medium flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {grain.location}
                              </div>
                            </div>
                            <div>
                              <span className="text-primary-500">Listed:</span>
                              <div className="font-medium flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(grain.createdAt)}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Link
                            to={`/grains/${grain._id}`}
                            className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/edit-grain/${grain._id}`}
                            className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteGrain(grain._id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          // Buyer Dashboard
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-primary-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/grains"
                  className="p-4 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  <Wheat className="h-8 w-8 text-primary-600 mb-2" />
                  <h3 className="font-medium text-primary-800">Browse Grains</h3>
                  <p className="text-sm text-primary-600">Find quality grains from farmers</p>
                </Link>
                
                <Link
                  to="/orders"
                  className="p-4 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  <Package className="h-8 w-8 text-primary-600 mb-2" />
                  <h3 className="font-medium text-primary-800">My Orders</h3>
                  <p className="text-sm text-primary-600">Track your purchases</p>
                </Link>
                
                <Link
                  to="/favorites"
                  className="p-4 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  <Users className="h-8 w-8 text-primary-600 mb-2" />
                  <h3 className="font-medium text-primary-800">Favorite Farmers</h3>
                  <p className="text-sm text-primary-600">Connect with trusted farmers</p>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-primary-800 mb-4">Recent Activity</h2>
              <p className="text-primary-600">No recent activity to show.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

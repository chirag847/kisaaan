import React from 'react';
import { Link } from 'react-router-dom';
import { Wheat, Shield, TrendingUp, Users, ArrowRight, Star } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-primary-800 mb-6">
                Fresh Grains,
                <span className="text-secondary-600"> Direct from Farms</span>
              </h1>
              <p className="text-xl text-primary-600 mb-8 max-w-lg">
                Connect directly with farmers. Buy premium quality grains with 
                verified samples and transparent pricing. Supporting agriculture, 
                one grain at a time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/grains"
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center"
                >
                  Browse Grains
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/register?role=farmer"
                  className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg hover:bg-primary-600 hover:text-white transition-colors font-semibold text-center"
                >
                  Start Selling
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-primary-800">Premium Wheat</h3>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <div className="aspect-video bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg mb-4 flex items-center justify-center">
                  <Wheat className="h-16 w-16 text-yellow-600" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-primary-500">Quantity:</span>
                    <div className="font-semibold">100 Quintals</div>
                  </div>
                  <div>
                    <span className="text-primary-500">Price:</span>
                    <div className="font-semibold text-secondary-600">₹2,500/quintal</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-primary-600 max-w-3xl mx-auto">
              We're revolutionizing the grain trade with technology, transparency, and trust.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-3">Quality Assured</h3>
              <p className="text-primary-600">
                Every grain listing includes detailed quality information and sample photos 
                for complete transparency.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-3">Fair Pricing</h3>
              <p className="text-primary-600">
                Real-time market rates and transparent pricing ensure fair deals 
                for both farmers and buyers.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-3">Direct Connection</h3>
              <p className="text-primary-600">
                Skip the middlemen. Connect directly with farmers and buyers 
                for better margins and relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-800 mb-2">5,000+</div>
              <div className="text-primary-600">Active Farmers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-800 mb-2">50,000+</div>
              <div className="text-primary-600">Quintals Traded</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-800 mb-2">₹10M+</div>
              <div className="text-primary-600">Total Trade Value</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-800 mb-2">98%</div>
              <div className="text-primary-600">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Grain Business?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers and buyers who trust our platform for their grain trade needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register?role=farmer"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors font-semibold"
            >
              Join as Farmer
            </Link>
            <Link
              to="/register?role=buyer"
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-primary-600 transition-colors font-semibold"
            >
              Join as Buyer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

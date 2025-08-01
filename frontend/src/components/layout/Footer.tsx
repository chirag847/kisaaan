import React from 'react';
import { Link } from 'react-router-dom';
import { Wheat, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

// Force module recognition
export {};

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Wheat className="h-8 w-8 text-primary-300" />
              <span className="text-xl font-bold">Farmers Marketplace</span>
            </div>
            <p className="text-primary-200 mb-4 max-w-md">
              Connecting farmers and buyers through a secure digital platform. 
              Transforming agriculture with technology for better livelihoods.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                className="text-primary-300 hover:text-white transition-colors"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a 
                href="https://twitter.com" 
                className="text-primary-300 hover:text-white transition-colors"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a 
                href="https://instagram.com" 
                className="text-primary-300 hover:text-white transition-colors"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/grains" 
                  className="text-primary-200 hover:text-white transition-colors"
                >
                  Browse Grains
                </Link>
              </li>
              <li>
                <Link 
                  to="/register?role=farmer" 
                  className="text-primary-200 hover:text-white transition-colors"
                >
                  Sell Grains
                </Link>
              </li>
              <li>
                <Link 
                  to="/register?role=buyer" 
                  className="text-primary-200 hover:text-white transition-colors"
                >
                  Buy Grains
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-primary-200 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-primary-200 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary-300" />
                <span className="text-primary-200">support@farmersmarketplace.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary-300" />
                <span className="text-primary-200">+91 98765 43210</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary-300 mt-1" />
                <span className="text-primary-200">
                  123 Agriculture Street,<br />
                  Farm City, FC 12345
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-primary-300 text-sm">
              © 2024 Farmers Marketplace. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link 
                to="/privacy" 
                className="text-primary-300 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-primary-300 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                to="/help" 
                className="text-primary-300 hover:text-white text-sm transition-colors"
              >
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
export default Footer;

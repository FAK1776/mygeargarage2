import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <img
              src="/logo.png"
              alt="My Gear Garage"
              className="h-12"
            />
          </div>
          
          <nav className="flex flex-wrap justify-center gap-6">
            <Link 
              to="/faq" 
              className="text-gray-600 hover:text-[#EE5430] transition-colors"
            >
              FAQ
            </Link>
            <Link 
              to="/privacy" 
              className="text-gray-600 hover:text-[#EE5430] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="text-gray-600 hover:text-[#EE5430] transition-colors"
            >
              Terms of Service
            </Link>
            <a 
              href="mailto:support@mygeargarage.com"
              className="text-gray-600 hover:text-[#EE5430] transition-colors"
            >
              Contact Support
            </a>
          </nav>
        </div>
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} My Gear Garage. All rights reserved.
        </div>
      </div>
    </footer>
  );
}; 
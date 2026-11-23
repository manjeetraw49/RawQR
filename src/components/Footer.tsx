import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="inline-block">
          <img
            src="/logo.png"
            alt="RawQR Logo"
            className="h-7 w-auto object-contain"
          />
        </Link>

        {/* Clean Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-gray-500">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link to="/about" className="hover:text-blue-600 transition-colors">
            About
          </Link>
          <Link to="/contact" className="hover:text-blue-600 transition-colors">
            Contact
          </Link>
          <Link to="/privacy" className="hover:text-blue-600 transition-colors">
            Privacy Policy
          </Link>
        </div>

        {/* Copyright Notice */}
        <p className="text-xs text-gray-400">
          © {currentYear} RawQR. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaImages, FaHome, FaMagic } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary';
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <FaImages className="text-primary text-2xl" />
            <span className="text-xl font-bold text-gray-800">GoldenFrames</span>
          </Link>
          
          <div className="flex space-x-6">
            <Link to="/" className={`flex items-center space-x-1 ${isActive('/')}`}>
              <FaHome />
              <span>Home</span>
            </Link>
            <Link to="/gallery" className={`flex items-center space-x-1 ${isActive('/gallery')}`}>
              <FaImages />
              <span>Gallery</span>
            </Link>
            <Link to="/compilations" className={`flex items-center space-x-1 ${isActive('/compilations')}`}>
              <FaMagic />
              <span>AI Compilations</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

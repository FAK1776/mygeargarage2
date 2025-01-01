import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { FaBars, FaTimes } from 'react-icons/fa';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'My Gear' },
    { path: '/add-gear', label: 'Add Gear' },
    { path: '/timeline', label: 'Gear Timeline' },
    { path: '/profile', label: 'Profile' },
  ];

  return (
    <nav className="bg-[#EE5430] fixed w-full top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <div className="flex-shrink-0 transition-transform hover:scale-105">
            <img
              src="/logo.png"
              alt="My Gear Garage"
              className="h-20 cursor-pointer"
              onClick={() => navigate('/')}
            />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label }) => (
              <Button 
                key={path}
                onClick={() => navigate(path)}
                variant="ghost" 
                className={`
                  relative px-4 py-2 text-lg font-medium
                  transition-all duration-200 ease-in-out
                  ${isActive(path) 
                    ? 'text-white bg-white/20' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                  }
                  group
                `}
              >
                {label}
                <span className={`
                  absolute bottom-0 left-0 w-full h-0.5 bg-white transform origin-left
                  transition-transform duration-200
                  ${isActive(path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                `} />
              </Button>
            ))}
            <Button 
              onClick={handleSignOut}
              variant="ghost" 
              className="
                ml-2 px-4 py-2 text-lg font-medium
                text-white/90 hover:text-white
                transition-all duration-200
                border border-white/20 hover:border-white/40
                hover:bg-white/10
              "
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className={`
          md:hidden 
          ${isMenuOpen ? 'block' : 'hidden'}
          pb-4
        `}>
          <div className="flex flex-col space-y-2">
            {navItems.map(({ path, label }) => (
              <Button 
                key={path}
                onClick={() => {
                  navigate(path);
                  setIsMenuOpen(false);
                }}
                variant="ghost" 
                className={`
                  w-full text-left px-4 py-3 text-lg font-medium
                  ${isActive(path) 
                    ? 'text-white bg-white/20' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {label}
              </Button>
            ))}
            <Button 
              onClick={handleSignOut}
              variant="ghost" 
              className="
                w-full text-left px-4 py-3 text-lg font-medium
                text-white/90 hover:text-white
                border border-white/20 hover:border-white/40
                hover:bg-white/10
              "
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}; 
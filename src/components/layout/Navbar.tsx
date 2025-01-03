import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { FaBars, FaTimes } from 'react-icons/fa';
import { theme } from '../../styles/theme';

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
    { path: '/maintenance', label: 'Maintenance' },
    { path: '/profile', label: 'Profile' },
  ];

  return (
    <nav style={{ backgroundColor: theme.colors.primary.steel }} className="fixed w-full top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <div className="flex-shrink-0 transition-transform hover:scale-105">
            <img
              src="/images/AxeVault_headerlogo.png"
              alt="Axe Vault"
              className="h-20 cursor-pointer"
              onClick={() => navigate('/')}
            />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
            style={{ color: theme.colors.text.inverse }}
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
                  group
                `}
                style={{
                  color: theme.colors.text.inverse,
                  backgroundColor: isActive(path) 
                    ? `${theme.colors.primary.steel}CC`
                    : 'transparent',
                }}
              >
                {label}
                <span 
                  className="absolute bottom-0 left-0 w-full h-0.5 transform origin-left transition-transform duration-200"
                  style={{
                    backgroundColor: theme.colors.primary.gold,
                    transform: isActive(path) ? 'scaleX(1)' : 'scaleX(0)',
                  }}
                />
              </Button>
            ))}
            <Button 
              onClick={handleSignOut}
              variant="ghost" 
              className="ml-2 px-4 py-2 text-lg font-medium transition-all duration-200"
              style={{
                color: theme.colors.text.inverse,
                border: `1px solid ${theme.colors.text.inverse}20`,
                ':hover': {
                  backgroundColor: `${theme.colors.text.inverse}10`,
                  borderColor: `${theme.colors.text.inverse}40`,
                }
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className={`md:hidden pb-4 ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="flex flex-col space-y-2">
            {navItems.map(({ path, label }) => (
              <Button 
                key={path}
                onClick={() => {
                  navigate(path);
                  setIsMenuOpen(false);
                }}
                variant="ghost" 
                className="w-full text-left px-4 py-3 text-lg font-medium"
                style={{
                  color: theme.colors.text.inverse,
                  backgroundColor: isActive(path) 
                    ? `${theme.colors.primary.steel}CC`
                    : 'transparent',
                }}
              >
                {label}
              </Button>
            ))}
            <Button 
              onClick={handleSignOut}
              variant="ghost" 
              className="w-full text-left px-4 py-3 text-lg font-medium"
              style={{
                color: theme.colors.text.inverse,
                border: `1px solid ${theme.colors.text.inverse}20`,
                ':hover': {
                  backgroundColor: `${theme.colors.text.inverse}10`,
                  borderColor: `${theme.colors.text.inverse}40`,
                }
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}; 
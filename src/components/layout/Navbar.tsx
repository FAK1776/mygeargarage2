import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';

export const Navbar = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-[#EE5430]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="My Gear Garage"
              className="h-12 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => navigate('/')}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button 
              onClick={() => navigate('/')}
              variant="ghost" 
              className="text-white hover:text-gray-200"
            >
              My Garage
            </Button>
            <Button 
              onClick={() => navigate('/add-gear')}
              variant="ghost" 
              className="text-white hover:text-gray-200"
            >
              Add Gear
            </Button>
            <Button 
              onClick={handleSignOut}
              variant="ghost" 
              className="text-white hover:text-gray-200"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}; 
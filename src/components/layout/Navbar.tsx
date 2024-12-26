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
    <nav className="bg-[#EE5430] fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="My Gear Garage"
              className="h-20 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => navigate('/')}
            />
          </div>

          <div className="flex items-center space-x-6">
            <Button 
              onClick={() => navigate('/')}
              variant="ghost" 
              className="text-white hover:text-gray-200 text-lg font-medium"
            >
              My Garage
            </Button>
            <Button 
              onClick={() => navigate('/add-gear')}
              variant="ghost" 
              className="text-white hover:text-gray-200 text-lg font-medium"
            >
              Add Gear
            </Button>
            <Button 
              onClick={handleSignOut}
              variant="ghost" 
              className="text-white hover:text-gray-200 text-lg font-medium"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}; 
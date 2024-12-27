import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GearCard } from '../components/gear/GearCard';
import { GearDetailsOverlay } from '../components/gear/GearDetailsOverlay';
import { useAuth } from '../hooks/useAuth';
import { GearService } from '../services/gearService';
import { BaseGear, GearStatus } from '../types/gear';
import { CollectionChat } from '../components/chat/CollectionChat';

export const MyGear = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gear, setGear] = useState<BaseGear[]>([]);
  const [wishlist, setWishlist] = useState<BaseGear[]>([]);
  const [selectedGear, setSelectedGear] = useState<BaseGear | null>(null);
  const gearService = new GearService();

  useEffect(() => {
    if (!user) return;

    const loadGear = async () => {
      try {
        const userGear = await gearService.getUserGear(user.uid);
        const userWishlist = await gearService.getUserWishlist(user.uid);
        setGear(userGear);
        setWishlist(userWishlist);
      } catch (error) {
        console.error('Error loading gear:', error);
      }
    };

    loadGear();
  }, [user]);

  const handleGearClick = (gear: BaseGear) => {
    setSelectedGear(gear);
  };

  const handleGearUpdate = async (updatedGear: BaseGear) => {
    try {
      await gearService.updateGear(updatedGear);
      setGear(prev => prev.map(g => g.id === updatedGear.id ? updatedGear : g));
      setSelectedGear(updatedGear);
    } catch (error) {
      console.error('Error updating gear:', error);
    }
  };

  const handleGearDelete = async (gearId: string) => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to delete this gear?')) {
      try {
        await gearService.deleteGear(user.uid, gearId);
        setGear(prev => prev.filter(g => g.id !== gearId));
      } catch (error) {
        console.error('Error deleting gear:', error);
      }
    }
  };

  const handleStatusChange = async (gear: BaseGear, status: GearStatus) => {
    if (!user) return;

    try {
      await gearService.updateGearStatus(user.uid, gear.id, status);
      setGear(prev => prev.map(g => g.id === gear.id ? { ...g, status } : g));
    } catch (error) {
      console.error('Error updating gear status:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-light text-gray-900">My Gear</h1>
          <button
            onClick={() => navigate('/add-gear')}
            className="bg-[#EE5430] text-white px-4 py-2 rounded hover:bg-[#EE5430]/90 transition-colors"
          >
            Add Gear
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gear.map(item => (
            <GearCard
              key={item.id}
              gear={item}
              onClick={() => handleGearClick(item)}
              onDelete={() => handleGearDelete(item.id)}
              onStatusChange={(status) => handleStatusChange(item, status)}
            />
          ))}
        </div>

        {selectedGear && (
          <GearDetailsOverlay
            gear={selectedGear}
            onClose={() => setSelectedGear(null)}
            onUpdate={handleGearUpdate}
          />
        )}
      </div>

      <CollectionChat gear={gear} wishlist={wishlist} />
    </>
  );
}; 
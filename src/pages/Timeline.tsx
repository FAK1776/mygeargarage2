import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { GearService } from '../services/gearService';
import { BaseGear } from '../types/gear';
import { TimelineView } from '../components/timeline/TimelineView';

const TimelinePage: React.FC = () => {
  const { user } = useAuth();
  const [gear, setGear] = useState<BaseGear[]>([]);
  const [loading, setLoading] = useState(true);

  const gearService = new GearService();

  useEffect(() => {
    const fetchGear = async () => {
      if (!user) return;
      try {
        const userGear = await gearService.getUserGear(user.uid);
        setGear(userGear);
      } catch (error) {
        console.error('Error fetching gear:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGear();
  }, [user]);

  const handleGearUpdate = (updatedGear: BaseGear) => {
    setGear(prev => prev.map(g => g.id === updatedGear.id ? updatedGear : g));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EE5430]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 pt-28">
        <h1 className="text-h1 mb-8">My Timeline</h1>
        <TimelineView gear={gear} onUpdate={handleGearUpdate} />
      </div>
    </div>
  );
};

export default TimelinePage; 
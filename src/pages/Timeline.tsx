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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32">
      <TimelineView gear={gear} />
    </div>
  );
};

export default TimelinePage; 
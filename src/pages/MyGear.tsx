import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GearCard } from '../components/gear/GearCard';
import { GearDetailsOverlay } from '../components/gear/GearDetailsOverlay';
import { useAuth } from '../hooks/useAuth';
import { GearService } from '../services/gearService';
import { BaseGear, GearStatus } from '../types/gear';
import { CollectionChat } from '../components/chat/CollectionChat';
import { Search } from 'lucide-react';
import { loadSampleData } from '../utils/sampleData';

type FilterStatus = GearStatus | 'all';

export const MyGear = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gear, setGear] = useState<BaseGear[]>([]);
  const [filteredGear, setFilteredGear] = useState<BaseGear[]>([]);
  const [selectedGear, setSelectedGear] = useState<BaseGear | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [loading, setLoading] = useState(true);
  const [loadingSample, setLoadingSample] = useState(false);
  const gearService = new GearService();

  useEffect(() => {
    if (!user) return;

    const loadGear = async () => {
      try {
        const userGear = await gearService.getUserGear(user.uid);
        setGear(userGear);
        setFilteredGear(userGear);
      } catch (error) {
        console.error('Error loading gear:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGear();
  }, [user]);

  // Filter gear based on search query and status
  useEffect(() => {
    let filtered = gear;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        // Search in basic info
        if (
          item.make?.toLowerCase().includes(query) ||
          item.model?.toLowerCase().includes(query) ||
          item.serialNumber?.toLowerCase().includes(query)
        ) {
          return true;
        }

        // Search in specifications
        const specs = item.specs;
        
        // Helper function to search in an object's values
        const searchInObject = (obj: Record<string, any>) => {
          if (!obj || typeof obj !== 'object') return false;
          return Object.values(obj).some(value => 
            typeof value === 'string' && value.toLowerCase().includes(query)
          );
        };

        // Search in all specification categories
        return specs && (
          searchInObject(specs.body) ||
          searchInObject(specs.neck) ||
          searchInObject(specs.headstock) ||
          searchInObject(specs.hardware) ||
          searchInObject(specs.electronics) ||
          searchInObject(specs.extras)
        );
      });
    }

    setFilteredGear(filtered);
  }, [searchQuery, statusFilter, gear]);

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
        setFilteredGear(prev => prev.filter(g => g.id !== gearId));
      } catch (error) {
        console.error('Error deleting gear:', error);
      }
    }
  };

  const handleStatusChange = async (gear: BaseGear, newStatus: GearStatus) => {
    if (!user) return;
    
    try {
      await gearService.updateGearStatus(user.uid, gear.id, newStatus);
      setGear(prev => prev.map(g => 
        g.id === gear.id ? { ...g, status: newStatus } : g
      ));
      setFilteredGear(prev => prev.map(g => 
        g.id === gear.id ? { ...g, status: newStatus } : g
      ));
    } catch (error) {
      console.error('Error updating gear status:', error);
    }
  };

  const handleLoadSampleData = async () => {
    if (!user) return;
    
    try {
      setLoadingSample(true);
      await loadSampleData(user.uid);
      // Refresh the gear list
      const userGear = await gearService.getUserGear(user.uid);
      setGear(userGear);
      setFilteredGear(userGear);
    } catch (error) {
      console.error('Error loading sample data:', error);
    } finally {
      setLoadingSample(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="container mx-auto px-4 pt-28 pb-8 max-w-7xl">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-light text-gray-900">My Gear</h1>
            <div className="flex gap-4">
              <button
                onClick={handleLoadSampleData}
                disabled={loadingSample}
                className="whitespace-nowrap px-4 py-2 text-gray-700 hover:text-gray-900 font-medium disabled:opacity-50 border border-gray-200 rounded-md hover:bg-gray-50"
              >
                {loadingSample ? 'Loading...' : 'Load Sample Data'}
              </button>
              <button
                onClick={() => navigate('/add-gear')}
                className="bg-[#EE5430] text-white px-4 py-2 rounded hover:bg-[#EE5430]/90 transition-colors"
              >
                Add Gear
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search all specifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE5430]"
              />
            </div>
            <div className="flex gap-2 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  statusFilter === 'all' 
                    ? 'bg-[#EE5430] text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter(GearStatus.Own)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  statusFilter === GearStatus.Own 
                    ? 'bg-green-500 text-white' 
                    : 'hover:bg-green-100'
                }`}
              >
                Own
              </button>
              <button
                onClick={() => setStatusFilter(GearStatus.Want)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  statusFilter === GearStatus.Want 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-blue-100'
                }`}
              >
                Want
              </button>
              <button
                onClick={() => setStatusFilter(GearStatus.Sold)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  statusFilter === GearStatus.Sold 
                    ? 'bg-gray-500 text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                Sold
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EE5430] mx-auto"></div>
          </div>
        ) : filteredGear.length === 0 ? (
          <div className="text-center py-12">
            {searchQuery || statusFilter !== 'all' ? (
              <p className="text-gray-500 mb-4">No guitars match your criteria.</p>
            ) : (
              <>
                <p className="text-gray-500 mb-4">No guitars in your collection yet.</p>
                <button
                  onClick={() => navigate('/add-gear')}
                  className="px-4 py-2 bg-[#EE5430] hover:bg-[#EE5430]/90 text-white font-medium rounded-md"
                >
                  Add Your First Gear
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGear.map(item => (
              <GearCard
                key={item.id}
                gear={item}
                onClick={() => handleGearClick(item)}
                onDelete={() => handleGearDelete(item.id)}
                onStatusChange={(status) => handleStatusChange(item, status)}
              />
            ))}
          </div>
        )}

        {selectedGear && (
          <GearDetailsOverlay
            gear={selectedGear}
            onClose={() => setSelectedGear(null)}
            onUpdate={handleGearUpdate}
          />
        )}
      </div>

      <CollectionChat gear={gear} wishlist={[]} />
    </>
  );
}; 
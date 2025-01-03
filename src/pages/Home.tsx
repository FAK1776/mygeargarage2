import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
import { GearService } from '../services/gearService';
import { BaseGear, GearStatus } from '../types/gear';
import { GearCard } from '../components/gear/GearCard';
import { GearDetailsOverlay } from '../components/gear/GearDetailsOverlay';
import { loadSampleData } from '../utils/sampleData';
import { Search } from 'lucide-react';

const gearService = new GearService();

type FilterStatus = GearStatus | 'all';

export const Home = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [gear, setGear] = useState<BaseGear[]>([]);
  const [filteredGear, setFilteredGear] = useState<BaseGear[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSample, setLoadingSample] = useState(false);
  const [selectedGear, setSelectedGear] = useState<BaseGear | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');

  useEffect(() => {
    if (!user) return;
    
    const fetchGear = async () => {
      try {
        const userGear = await gearService.getUserGear(user.uid);
        setGear(userGear);
        setFilteredGear(userGear);
      } catch (error) {
        console.error('Error fetching gear:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGear();
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
          item.modelName?.toLowerCase().includes(query) ||
          item.modelNumber?.toLowerCase().includes(query) ||
          item.series?.toLowerCase().includes(query) ||
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
        return (
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

  const handleDelete = async (gearId: string) => {
    if (!user) return;
    
    try {
      await gearService.deleteGear(user.uid, gearId);
      setGear(prev => prev.filter(g => g.id !== gearId));
      setFilteredGear(prev => prev.filter(g => g.id !== gearId));
    } catch (error) {
      console.error('Error deleting gear:', error);
    }
  };

  const handleStatusChange = async (gearId: string, newStatus: GearStatus) => {
    if (!user) return;
    
    try {
      await gearService.updateGearStatus(user.uid, gearId, newStatus);
      setGear(prev => prev.map(g => 
        g.id === gearId ? { ...g, status: newStatus } : g
      ));
      setFilteredGear(prev => prev.map(g => 
        g.id === gearId ? { ...g, status: newStatus } : g
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
    return (
      <div className="min-h-screen bg-gray-50 pt-32">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-light text-gray-900">Please log in to view your gear.</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-light text-gray-900">My Gear</h1>
            <button
              onClick={() => navigate('/add-gear')}
              className="px-4 py-2 bg-[#EE5430] hover:bg-[#EE5430]/90 text-white font-medium rounded-md"
            >
              Add Gear
            </button>
          </div>

          <p className="text-gray-600">
            Manage your gear collection, track modifications, and keep a record of your instruments' history.
          </p>

          <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {/* Search input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all specifications..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            {/* Status Filter */}
            <div className="flex bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
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
                onClick={() => setStatusFilter(GearStatus.Wishlist)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  statusFilter === GearStatus.Wishlist 
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

            <button
              onClick={handleLoadSampleData}
              disabled={loadingSample}
              className="whitespace-nowrap px-4 py-2 text-gray-700 hover:text-gray-900 font-medium disabled:opacity-50 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              {loadingSample ? 'Loading...' : 'Load Sample Data'}
            </button>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {filteredGear.map((item) => (
              <GearCard
                key={item.id}
                gear={item}
                onClick={() => setSelectedGear(item)}
                onDelete={() => handleDelete(item.id)}
                onStatusChange={(status) => handleStatusChange(item.id, status)}
              />
            ))}
          </div>
        )}

        {selectedGear && (
          <GearDetailsOverlay
            gear={selectedGear}
            onClose={() => setSelectedGear(null)}
            onUpdate={(updatedGear) => {
              setGear(prev => prev.map(g => g.id === updatedGear.id ? updatedGear : g));
              setSelectedGear(updatedGear);
            }}
          />
        )}
      </div>
    </div>
  );
}; 
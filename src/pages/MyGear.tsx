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
import { useGearFilters } from '../hooks/useGearFilters';
import { StatusToggle } from '../components/gear/StatusToggle';

export const MyGear = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gear, setGear] = useState<BaseGear[]>([]);
  const [selectedGear, setSelectedGear] = useState<BaseGear | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSample, setLoadingSample] = useState(false);
  const gearService = new GearService();

  const {
    filteredGear,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
  } = useGearFilters({ gear });

  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; gearId: string | null }>({
    isOpen: false,
    gearId: null
  });

  useEffect(() => {
    if (!user) return;

    const loadGear = async () => {
      try {
        const userGear = await gearService.getUserGear(user.uid);
        setGear(userGear);
      } catch (error) {
        console.error('Error loading gear:', error);
      } finally {
        setLoading(false);
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
    
    console.log('Attempting to delete gear:', gearId);
    setDeleteConfirmation({ isOpen: true, gearId });
  };

  const handleConfirmDelete = async () => {
    if (!user || !deleteConfirmation.gearId) return;
    
    try {
      console.log('User confirmed deletion');
      await gearService.deleteGear(user.uid, deleteConfirmation.gearId);
      console.log('Successfully deleted gear from Firestore');
      setGear(prev => {
        console.log('Updating gear state, removing:', deleteConfirmation.gearId);
        return prev.filter(g => g.id !== deleteConfirmation.gearId);
      });
    } catch (error) {
      console.error('Error deleting gear:', error);
    } finally {
      setDeleteConfirmation({ isOpen: false, gearId: null });
    }
  };

  const handleCancelDelete = () => {
    console.log('User cancelled deletion');
    setDeleteConfirmation({ isOpen: false, gearId: null });
  };

  const handleStatusChange = async (gear: BaseGear, newStatus: GearStatus) => {
    if (!user) return;
    
    try {
      await gearService.updateGearStatus(user.uid, gear.id, newStatus);
      setGear(prev => prev.map(g => 
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
            <StatusToggle
              currentStatus={statusFilter}
              onStatusChange={setStatusFilter}
              className="border border-gray-200"
            />
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

        {/* Delete Confirmation Dialog */}
        {deleteConfirmation.isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Gear</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this gear? This action cannot be undone.</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <CollectionChat gear={gear} wishlist={[]} />
    </>
  );
}; 
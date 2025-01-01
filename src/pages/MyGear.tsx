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
import { useGearSort } from '../hooks/useGearSort';
import { StatusToggle } from '../components/gear/StatusToggle';
import { SortDropdown } from '../components/ui/sort-dropdown';

export const MyGear = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gear, setGear] = useState<BaseGear[]>([]);
  const [selectedGear, setSelectedGear] = useState<BaseGear | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSample, setLoadingSample] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; gearId: string | null }>({
    isOpen: false,
    gearId: null
  });
  const gearService = new GearService();

  const {
    filteredGear,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
  } = useGearFilters({ gear });

  const {
    sortedGear,
    currentSort,
    setCurrentSort,
    sortOptions
  } = useGearSort({ gear: filteredGear });

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

  const handleGearUpdate = async (updatedGear: BaseGear, shouldSave: boolean = false) => {
    if (!user) return;
    try {
      if (shouldSave) {
        await gearService.updateGear(user.uid, updatedGear.id, updatedGear);
      }
      setGear(prev => prev.map(g => g.id === updatedGear.id ? updatedGear : g));
      setSelectedGear(updatedGear);
    } catch (error) {
      console.error('Error updating gear:', error);
    }
  };

  const handleGearDelete = async (gearId: string) => {
    if (!user) return;
    setDeleteConfirmation({ isOpen: true, gearId });
  };

  const handleConfirmDelete = async () => {
    if (!user || !deleteConfirmation.gearId) return;
    
    try {
      await gearService.deleteGear(user.uid, deleteConfirmation.gearId);
      setGear(prev => prev.filter(g => g.id !== deleteConfirmation.gearId));
      setSelectedGear(null);
    } catch (error) {
      console.error('Error deleting gear:', error);
    } finally {
      setDeleteConfirmation({ isOpen: false, gearId: null });
    }
  };

  const handleCancelDelete = () => {
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 pt-28">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <h1 className="text-h1 mb-4 sm:mb-0">My Gear</h1>
            <div className="flex gap-2 sm:gap-4">
              <button
                onClick={handleLoadSampleData}
                disabled={loadingSample}
                className="whitespace-nowrap px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 hover:text-gray-900 font-medium disabled:opacity-50 border border-gray-200 rounded-md hover:bg-gray-50"
              >
                {loadingSample ? 'Loading...' : 'Load Sample Data'}
              </button>
              <button
                onClick={() => navigate('/add-gear')}
                className="bg-[#EE5430] text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded hover:bg-[#EE5430]/90 transition-colors"
              >
                Add Gear
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search all specifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE5430]"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <SortDropdown
                options={sortOptions}
                currentSort={currentSort}
                onSortChange={setCurrentSort}
                className="w-full sm:w-48"
              />
              <StatusToggle
                currentStatus={statusFilter}
                onStatusChange={setStatusFilter}
                className="border border-gray-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sortedGear.map((item) => (
              <GearCard
                key={item.id}
                gear={item}
                onClick={() => handleGearClick(item)}
                onDelete={() => handleGearDelete(item.id)}
                onStatusChange={(status) => handleStatusChange(item, status)}
              />
            ))}
          </div>

          {sortedGear.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                {searchQuery ? 'No items match your search criteria.' : 'Your collection is empty.'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => navigate('/add-gear')}
                  className="bg-[#EE5430] text-white px-4 py-2 rounded hover:bg-[#EE5430]/90 transition-colors"
                >
                  Add Your First Item
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedGear && (
        <GearDetailsOverlay
          gear={selectedGear}
          onClose={() => setSelectedGear(null)}
          onUpdate={handleGearUpdate}
          isOpen={true}
        />
      )}

      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Gear</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this gear? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <CollectionChat gear={gear} wishlist={[]} />
    </>
  );
}; 
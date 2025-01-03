import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GearCard } from '../components/gear/GearCard';
import { GearDetailsOverlay } from '../components/gear/GearDetailsOverlay';
import { MyGearGuru } from '../components/gear/MyGearGuru';
import { useAuth } from '../hooks/useAuth';
import { GearService } from '../services/gearService';
import { BaseGear, GearStatus } from '../types/gear';
import { Search } from 'lucide-react';
import { loadSampleData } from '../utils/sampleData';
import { useGearFilters } from '../hooks/useGearFilters';
import { useGearSort } from '../hooks/useGearSort';
import { theme } from '../styles/theme';

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

  const handleDelete = (gearId: string) => {
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
    return (
      <div className="min-h-screen pt-32" style={{ backgroundColor: theme.colors.ui.backgroundAlt }}>
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-light" style={{ color: theme.colors.text.primary }}>
            Please log in to view your gear.
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16 relative bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-h1 mb-8">My Gear</h1>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all specifications..."
                className="flex h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EE5430] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 w-full pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            {/* Status filter */}
            <div 
              className="flex rounded-lg overflow-hidden shadow-sm" 
              style={{ 
                borderColor: theme.colors.ui.border,
                borderWidth: '1px',
                backgroundColor: theme.colors.ui.background,
                boxShadow: theme.shadows.sm
              }}
            >
              <button
                onClick={() => setStatusFilter('all')}
                className="px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: statusFilter === 'all' ? theme.colors.primary.steel : 'transparent',
                  color: statusFilter === 'all' ? theme.colors.text.inverse : theme.colors.text.primary,
                  ':hover': {
                    backgroundColor: statusFilter === 'all' ? undefined : theme.colors.ui.hover,
                  }
                }}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter(GearStatus.Own)}
                className="px-4 py-2 text-sm font-medium transition-colors border-l"
                style={{
                  backgroundColor: statusFilter === GearStatus.Own ? theme.colors.state.success : 'transparent',
                  color: statusFilter === GearStatus.Own ? theme.colors.text.inverse : theme.colors.text.primary,
                  borderColor: theme.colors.ui.border,
                  ':hover': {
                    backgroundColor: statusFilter === GearStatus.Own ? undefined : `${theme.colors.state.success}10`,
                  }
                }}
              >
                Own
              </button>
              <button
                onClick={() => setStatusFilter(GearStatus.Want)}
                className="px-4 py-2 text-sm font-medium transition-colors border-l"
                style={{
                  backgroundColor: statusFilter === GearStatus.Want ? theme.colors.primary.gold : 'transparent',
                  color: statusFilter === GearStatus.Want ? theme.colors.text.primary : theme.colors.text.primary,
                  borderColor: theme.colors.ui.border,
                  ':hover': {
                    backgroundColor: statusFilter === GearStatus.Want ? undefined : `${theme.colors.primary.gold}10`,
                  }
                }}
              >
                Want
              </button>
              <button
                onClick={() => setStatusFilter(GearStatus.Sold)}
                className="px-4 py-2 text-sm font-medium transition-colors border-l"
                style={{
                  backgroundColor: statusFilter === GearStatus.Sold ? theme.colors.primary.steel : 'transparent',
                  color: statusFilter === GearStatus.Sold ? theme.colors.text.inverse : theme.colors.text.primary,
                  borderColor: theme.colors.ui.border,
                  ':hover': {
                    backgroundColor: statusFilter === GearStatus.Sold ? undefined : theme.colors.ui.hover,
                  }
                }}
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

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EE5430] mx-auto"></div>
            </div>
          ) : sortedGear.length === 0 ? (
            <div className="text-center py-12">
              {searchQuery || statusFilter !== 'all' ? (
                <p className="text-gray-500">No guitars match your criteria.</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedGear.map((item) => (
                <GearCard
                  key={item.id}
                  gear={item}
                  onClick={() => handleGearClick(item)}
                  onDelete={() => handleDelete(item.id)}
                  onStatusChange={(status) => handleStatusChange(item, status)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Add the Gear Guru as a floating element */}
        <div 
          style={{ 
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 1000,
          }}
        >
          <MyGearGuru />
        </div>

        {selectedGear && (
          <GearDetailsOverlay
            gear={selectedGear}
            onClose={() => setSelectedGear(null)}
            onUpdate={handleGearUpdate}
            isOpen={!!selectedGear}
          />
        )}

        {deleteConfirmation.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4" style={{ backgroundColor: theme.colors.ui.background }}>
              <h3 className="text-xl font-semibold mb-4" style={{ color: theme.colors.text.primary }}>
                Confirm Delete
              </h3>
              <p className="mb-6" style={{ color: theme.colors.text.secondary }}>
                Are you sure you want to delete this gear? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 font-medium rounded-md transition-colors"
                  style={{
                    backgroundColor: 'transparent',
                    color: theme.colors.text.primary,
                    ':hover': {
                      backgroundColor: theme.colors.ui.hover,
                    }
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 font-medium rounded-md transition-colors"
                  style={{
                    backgroundColor: theme.colors.state.error,
                    color: theme.colors.text.inverse,
                    ':hover': {
                      backgroundColor: theme.colors.state.error,
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 
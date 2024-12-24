import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
import { GearService } from '../services/gearService';
import { BaseGear } from '../types/gear';
import { GearCard } from '../components/gear/GearCard';
import { GearDetailsOverlay } from '../components/gear/GearDetailsOverlay';
import { Search } from 'lucide-react';

const gearService = new GearService();

export const Wishlist = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [gear, setGear] = useState<BaseGear[]>([]);
  const [filteredGear, setFilteredGear] = useState<BaseGear[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGear, setSelectedGear] = useState<BaseGear | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) return;
    
    const fetchGear = async () => {
      try {
        const userGear = await gearService.getUserWishlist(user.uid);
        setGear(userGear);
        setFilteredGear(userGear);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGear();
  }, [user]);

  // Comprehensive search across all specifications
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredGear(gear);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = gear.filter(item => {
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
      const searchInObject = (obj: Record<string, string>) => {
        return Object.values(obj).some(value => 
          value?.toLowerCase().includes(query)
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

    setFilteredGear(filtered);
  }, [searchQuery, gear]);

  const handleDelete = async (gearId: string) => {
    if (!user) return;
    
    try {
      await gearService.deleteWishlistItem(user.uid, gearId);
      setGear(prev => prev.filter(g => g.id !== gearId));
      setFilteredGear(prev => prev.filter(g => g.id !== gearId));
    } catch (error) {
      console.error('Error deleting wishlist item:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-light text-gray-900">Please log in to view your wishlist.</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-8">
          <h1 className="text-3xl font-light text-gray-900">My Wishlist</h1>
          
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-center">
            {/* Search input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all specifications..."
                className="w-full md:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            <button
              onClick={() => navigate('/add-gear')}
              className="px-4 py-2 bg-[#EE5430] hover:bg-[#EE5430]/90 text-white font-medium rounded-md"
            >
              Add to Wishlist
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EE5430] mx-auto"></div>
          </div>
        ) : filteredGear.length === 0 ? (
          <div className="text-center py-12">
            {searchQuery ? (
              <p className="text-gray-500 mb-4">No items match your search criteria.</p>
            ) : (
              <>
                <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
                <button
                  onClick={() => navigate('/add-gear')}
                  className="px-4 py-2 bg-[#EE5430] hover:bg-[#EE5430]/90 text-white font-medium rounded-md"
                >
                  Add Your First Wishlist Item
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGear.map((item) => (
              <GearCard
                key={item.id}
                gear={item}
                onClick={() => setSelectedGear(item)}
                onDelete={() => handleDelete(item.id)}
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
              setFilteredGear(prev => prev.map(g => g.id === updatedGear.id ? updatedGear : g));
              setSelectedGear(updatedGear);
            }}
          />
        )}
      </div>
    </div>
  );
}; 
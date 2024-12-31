import React, { useState, useCallback, useEffect } from 'react';
import { BaseGear } from '../../types/gear';
import { FaTimes, FaEdit, FaSave, FaInfoCircle } from 'react-icons/fa';
import { GearService } from '../../services/gearService';
import { useAuth } from '../../hooks/useAuth';
import { GearImageGallery } from './details/GearImageGallery';
import { GearBasicInfo } from './details/GearBasicInfo';
import { GearPriceInfo } from './details/GearPriceInfo';
import { GearSpecs } from './details/specs/GearSpecs';
import { GearHistory } from './details/GearHistory';

interface GearDetailsOverlayProps {
  gear: BaseGear;
  onClose: () => void;
  onUpdate?: (gear: BaseGear) => void;
}

export const GearDetailsOverlay: React.FC<GearDetailsOverlayProps> = ({
  gear,
  onClose,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedGear, setEditedGear] = useState<BaseGear>(gear);
  const { user } = useAuth();
  const gearService = new GearService();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleUpdate = useCallback(async () => {
    if (!user) return;
    
    try {
      await gearService.updateGear(editedGear);
      onUpdate?.(editedGear);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating gear:', error);
    }
  }, [editedGear, user, onUpdate]);

  const handleGearUpdate = (updates: Partial<BaseGear>) => {
    const updatedGear = { ...editedGear, ...updates };
    setEditedGear(updatedGear);
    // Propagate updates immediately for image changes
    if (updates.images) {
      onUpdate?.(updatedGear);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!user) return;
    
    try {
      const updatedGear = await gearService.addImage(user.uid, editedGear.id, file);
      setEditedGear(updatedGear);
      onUpdate?.(updatedGear);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleClose = () => {
    // Ensure final state is propagated before closing
    if (JSON.stringify(gear) !== JSON.stringify(editedGear)) {
      onUpdate?.(editedGear);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-start justify-center p-0 sm:p-4">
        <div className="bg-white w-full sm:max-w-4xl sm:rounded-lg max-h-screen flex flex-col">
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm sm:rounded-t-lg">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-medium text-gray-900 truncate">
                  {editedGear.make} {editedGear.model}
                  {editedGear.year && <span className="ml-2 text-gray-500">({editedGear.year})</span>}
                </h2>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
                    title="Edit gear"
                  >
                    <FaEdit className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleUpdate}
                    className="p-2 text-green-600 hover:text-green-700 transition-colors rounded-full hover:bg-green-100"
                    title="Save changes"
                  >
                    <FaSave className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
                  title="Close"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <GearImageGallery 
                      gear={editedGear} 
                      onUpdate={handleGearUpdate}
                      onImageUpload={handleImageUpload}
                      isEditing={isEditing}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Gear History</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                      <FaInfoCircle className="text-[#EE5430]" />
                      <span>Record maintenance, modifications, and ownership changes</span>
                    </div>
                    <GearHistory
                      gear={editedGear}
                      isEditing={isEditing}
                      onUpdate={handleGearUpdate}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                    <GearBasicInfo
                      gear={editedGear}
                      isEditing={isEditing}
                      onUpdate={handleGearUpdate}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
                    <GearSpecs
                      gear={editedGear}
                      isEditing={isEditing}
                      onUpdate={handleGearUpdate}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Information</h3>
                    <GearPriceInfo
                      gear={editedGear}
                      isEditing={isEditing}
                      onUpdate={handleGearUpdate}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
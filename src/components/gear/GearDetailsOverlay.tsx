import React, { useState, useEffect, useCallback } from 'react';
import { BaseGear } from '../../types/gear';
import { FaTimes, FaEdit, FaSave } from 'react-icons/fa';
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

export const GearDetailsOverlay: React.FC<GearDetailsOverlayProps> = ({ gear, onClose, onUpdate }) => {
  const { user } = useAuth();
  const gearService = new GearService();
  const [isEditing, setIsEditing] = useState(false);
  const [editedGear, setEditedGear] = useState<BaseGear>(gear);

  const handleClose = useCallback(async () => {
    // Save any pending changes before closing
    if (onUpdate && JSON.stringify(gear) !== JSON.stringify(editedGear)) {
      await gearService.updateGear(editedGear);
      onUpdate(editedGear);
    }
    onClose();
  }, [gear, editedGear, onUpdate, onClose, gearService]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);

    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [handleClose]);

  const handleSave = async () => {
    if (onUpdate && user) {
      await gearService.updateGear(editedGear, user.uid);
      onUpdate(editedGear);
    }
    setIsEditing(false);
  };

  const handleGearUpdate = (updatedGear: BaseGear) => {
    setEditedGear(updatedGear);
  };

  const handleFieldUpdate = (updates: Partial<BaseGear>) => {
    setEditedGear(prev => ({ ...prev, ...updates }));
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-y-auto relative animate-in fade-in slide-in-from-bottom-4 duration-300"
      >
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes size={24} />
          </button>
          <div className="flex gap-2">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                <FaSave /> Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                <FaEdit /> Edit
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-12 gap-8">
            {/* Left Column - Images and History */}
            <div className="col-span-12 lg:col-span-5 space-y-8">
              <GearImageGallery gear={editedGear} onUpdate={handleGearUpdate} />
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">History</h2>
                <GearHistory gear={editedGear} isEditing={isEditing} onUpdate={handleFieldUpdate} />
              </div>
            </div>

            {/* Right Column - All Specifications */}
            <div className="col-span-12 lg:col-span-7 space-y-8">
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">Basic Information</h2>
                <GearBasicInfo gear={editedGear} isEditing={isEditing} onUpdate={handleFieldUpdate} />
              </div>
              
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">Price Information</h2>
                <GearPriceInfo gear={editedGear} isEditing={isEditing} onUpdate={handleFieldUpdate} />
              </div>

              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">Specifications</h2>
                <GearSpecs gear={editedGear} isEditing={isEditing} onUpdate={handleFieldUpdate} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
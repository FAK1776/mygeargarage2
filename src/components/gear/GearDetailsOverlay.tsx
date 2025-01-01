import React, { useState, useEffect } from 'react';
import { BaseGear, GearType, GuitarSpecs } from '../../types/gear';
import { GearImageGallery } from './details/GearImageGallery';
import { GearHistory } from './details/GearHistory';
import { GearService } from '../../services/gearService';
import { useAuth } from '../../hooks/useAuth';
import { GearDetailsHeader } from './details/GearDetailsHeader';
import { GearSpecifications } from './details/GearSpecifications';

export interface GearDetailsOverlayProps {
  gear: BaseGear;
  onClose: () => void;
  isOpen: boolean;
  onUpdate: (updatedGear: BaseGear) => void;
}

export const GearDetailsOverlay: React.FC<GearDetailsOverlayProps> = ({
  gear,
  onClose,
  isOpen,
  onUpdate
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [localGear, setLocalGear] = useState(gear);
  const specs = localGear.specs as GuitarSpecs;
  const { user } = useAuth();
  const gearService = new GearService();

  // Sync localGear with gear prop when it changes
  useEffect(() => {
    setLocalGear(gear);
  }, [gear]);

  // Prevent background scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Add escape key listener
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  const handleSpecUpdate = (category: string, subcategory: string | null, field: string, value: string | boolean) => {
    if (!specs) return;

    setLocalGear(prevGear => {
      const updatedSpecs = { ...prevGear.specs };
      if (subcategory) {
        updatedSpecs[category] = {
          ...updatedSpecs[category],
          [subcategory]: {
            ...updatedSpecs[category]?.[subcategory],
            [field]: value
          }
        };
      } else {
        updatedSpecs[category] = {
          ...updatedSpecs[category],
          [field]: value
        };
      }

      return {
        ...prevGear,
        specs: updatedSpecs
      };
    });
  };

  const handleSave = () => {
    onUpdate(localGear);
    setIsEditMode(false);
  };

  const handleImageUpload = async (files: File[]) => {
    if (!user?.uid || !gear.id) {
      console.error('User ID or Gear ID missing');
      return;
    }

    try {
      const result = await gearService.addImages(user.uid, gear.id, files);
      if (result.images) {
        onUpdate({ 
          ...gear, 
          images: result.images 
        });
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto ${
        isOpen ? 'block' : 'hidden'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <GearDetailsHeader
            gear={gear}
            isEditMode={isEditMode}
            onSave={handleSave}
            onEdit={() => setIsEditMode(true)}
            onClose={onClose}
          />

          <div className="flex-1 overflow-y-auto">
            <div className="flex gap-8 p-6">
              {/* Left Column */}
              <div className="w-1/3 space-y-8">
                <GearImageGallery
                  gear={gear}
                  onUpdate={onUpdate}
                  onImageUpload={handleImageUpload}
                  isEditing={true}
                />

                <div className="border-t pt-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Instrument History</h2>
                  <GearHistory
                    gear={gear}
                    onUpdate={onUpdate}
                    isEditing={true}
                  />
                </div>
              </div>

              {/* Right Column - Specifications */}
              <GearSpecifications
                gear={gear}
                specs={specs}
                isEditMode={isEditMode}
                onSpecUpdate={handleSpecUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
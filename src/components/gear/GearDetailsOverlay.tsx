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
      className={`fixed inset-0 z-50 ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Content */}
      <div className="fixed inset-0 pt-[64px] pointer-events-none">
        <div className="container mx-auto max-w-4xl h-full">
          <div 
            className="pointer-events-auto bg-white h-full overflow-y-auto rounded-t-lg shadow-xl"
          >
            <GearDetailsHeader
              gear={gear}
              isEditMode={isEditMode}
              onSave={handleSave}
              onEdit={() => setIsEditMode(true)}
              onClose={onClose}
            />

            <div className="px-6 py-6">
              <div className="flex gap-8">
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
    </div>
  );
}; 
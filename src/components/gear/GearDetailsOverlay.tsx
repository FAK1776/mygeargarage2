import React, { useState } from 'react';
import { BaseGear } from '../../types/gear';
import { FaTimes, FaEdit, FaSave } from 'react-icons/fa';
import { GearService } from '../../services/gearService';
import { useAuth } from '../../hooks/useAuth';
import { GearImageGallery } from './details/GearImageGallery';
import { GearBasicInfo } from './details/GearBasicInfo';
import { GearPriceInfo } from './details/GearPriceInfo';
import { GearSpecs } from './details/specs/GearSpecs';

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

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedGear);
    }
    setIsEditing(false);
  };

  const handleGearUpdate = (updatedGear: BaseGear) => {
    setEditedGear(updatedGear);
    if (onUpdate) {
      onUpdate(updatedGear);
    }
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
        className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto relative animate-in fade-in slide-in-from-bottom-4 duration-300"
      >
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
          <button
            onClick={onClose}
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
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left column - Images */}
            <div className="lg:w-1/2">
              <h2 className="text-2xl font-bold mb-4">
                {gear.make} {gear.model}{gear.year ? ` (${gear.year})` : ''}
              </h2>
              <GearImageGallery gear={editedGear} onUpdate={handleGearUpdate} />
            </div>

            {/* Right column - Details */}
            <div className="lg:w-1/2 space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <GearBasicInfo 
                  gear={editedGear} 
                  isEditing={isEditing} 
                  onUpdate={handleFieldUpdate} 
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Price & Date Information</h3>
                <GearPriceInfo 
                  gear={editedGear} 
                  isEditing={isEditing} 
                  onUpdate={handleFieldUpdate} 
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                <GearSpecs 
                  gear={editedGear} 
                  isEditing={isEditing} 
                  onUpdate={handleFieldUpdate} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
import React from 'react';
import { BaseGear, GearType, GuitarSpecs } from '../../../../types/gear';
import { GuitarSpecsForm } from './GuitarSpecsForm';

interface GearSpecsProps {
  gear: BaseGear;
  isEditing: boolean;
  onUpdate: (updates: Partial<BaseGear>) => void;
}

export const GearSpecs: React.FC<GearSpecsProps> = ({ gear, isEditing, onUpdate }) => {
  const handleSpecsUpdate = (specs: Partial<GuitarSpecs>) => {
    onUpdate({ specs: { ...gear.specs, ...specs } });
  };

  switch (gear.type) {
    case GearType.Guitar:
    case GearType.Bass:
      return (
        <GuitarSpecsForm 
          specs={gear.specs as GuitarSpecs} 
          isEditing={isEditing} 
          onUpdate={handleSpecsUpdate} 
        />
      );
    // Add more cases for other gear types here
    default:
      return null;
  }
}; 
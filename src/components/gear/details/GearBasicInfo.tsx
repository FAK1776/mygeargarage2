import React from 'react';
import { BaseGear, GearType } from '../../../types/gear';
import { FormField } from '../../common/FormField';

interface GearBasicInfoProps {
  gear: BaseGear;
  isEditing: boolean;
  onUpdate: (updates: Partial<BaseGear>) => void;
}

export const GearBasicInfo: React.FC<GearBasicInfoProps> = ({ gear, isEditing, onUpdate }) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Type"
        value={gear.type}
        isEditing={isEditing}
        type="select"
        options={Object.values(GearType)}
        onChange={(value) => onUpdate({ type: value as GearType })}
      />
      <FormField
        label="Make"
        value={gear.make}
        isEditing={isEditing}
        onChange={(value) => onUpdate({ make: value })}
      />
      <FormField
        label="Model"
        value={gear.model}
        isEditing={isEditing}
        onChange={(value) => onUpdate({ model: value })}
      />
      <FormField
        label="Year"
        value={gear.year}
        isEditing={isEditing}
        onChange={(value) => onUpdate({ year: value })}
      />
      <FormField
        label="Model Number"
        value={gear.modelNumber}
        isEditing={isEditing}
        onChange={(value) => onUpdate({ modelNumber: value })}
      />
      <FormField
        label="Series"
        value={gear.series}
        isEditing={isEditing}
        onChange={(value) => onUpdate({ series: value })}
      />
      <FormField
        label="Serial Number"
        value={gear.serialNumber}
        isEditing={isEditing}
        onChange={(value) => onUpdate({ serialNumber: value })}
      />
      <FormField
        label="Place of Origin"
        value={gear.placeOfOrigin}
        isEditing={isEditing}
        onChange={(value) => onUpdate({ placeOfOrigin: value })}
      />
      <FormField
        label="Orientation"
        value={gear.orientation}
        isEditing={isEditing}
        onChange={(value) => onUpdate({ orientation: value })}
      />
      <FormField
        label="Number of Strings"
        value={gear.numberOfStrings}
        isEditing={isEditing}
        type="number"
        onChange={(value) => onUpdate({ numberOfStrings: value })}
      />
      <FormField
        label="Weight"
        value={gear.weight}
        isEditing={isEditing}
        onChange={(value) => onUpdate({ weight: value })}
      />
      <FormField
        label="Description"
        value={gear.description}
        isEditing={isEditing}
        type="textarea"
        onChange={(value) => onUpdate({ description: value })}
      />
    </div>
  );
}; 
import React from 'react';
import { BaseGear } from '../../../types/gear';
import { FormField } from '../../common/FormField';

interface GearBasicInfoProps {
  gear: BaseGear;
  isEditing: boolean;
  onUpdate: (updates: Partial<BaseGear>) => void;
}

export const GearBasicInfo: React.FC<GearBasicInfoProps> = ({ gear, isEditing, onUpdate }) => {
  return (
    <div className="grid gap-2">
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
        label="Serial Number"
        value={gear.serialNumber}
        isEditing={isEditing}
        onChange={(value) => onUpdate({ serialNumber: value })}
      />
      <FormField
        label="Country of Origin"
        value={gear.placeOfOrigin}
        isEditing={isEditing}
        onChange={(value) => onUpdate({ placeOfOrigin: value })}
        placeholder="e.g., USA, Japan, Mexico"
      />
      <FormField
        label="Orientation"
        value={gear.orientation}
        isEditing={isEditing}
        type="select"
        options={[
          { value: "Right Handed", label: "Right Handed" },
          { value: "Left Handed", label: "Left Handed" }
        ]}
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
      <FormField
        label="Label"
        value={gear.label}
        isEditing={isEditing}
        type="textarea"
        onChange={(value) => onUpdate({ label: value })}
        placeholder="For commemorative or custom guitars"
      />
      <FormField
        label="Pleked"
        value={gear.pleked ? "Yes" : "No"}
        isEditing={isEditing}
        type="select"
        options={[
          { value: "false", label: "No" },
          { value: "true", label: "Yes" }
        ]}
        onChange={(value) => onUpdate({ pleked: value === "true" })}
      />
    </div>
  );
}; 
import React from 'react';
import { BaseGear } from '../../../types/gear';
import { FormField } from '../../common/FormField';

interface GearPriceInfoProps {
  gear: BaseGear;
  isEditing: boolean;
  onUpdate: (updates: Partial<BaseGear>) => void;
}

export const GearPriceInfo: React.FC<GearPriceInfoProps> = ({ gear, isEditing, onUpdate }) => {
  return (
    <div className="space-y-4">
      <FormField
        label="Date Acquired"
        value={gear.dateAcquired}
        isEditing={isEditing}
        type="date"
        onChange={(value) => onUpdate({ dateAcquired: value })}
      />
      <FormField
        label="Price Paid"
        value={gear.pricePaid}
        isEditing={isEditing}
        type="number"
        onChange={(value) => onUpdate({ pricePaid: value })}
      />
      <FormField
        label="Acquisition Notes"
        value={gear.acquisitionNotes}
        isEditing={isEditing}
        type="textarea"
        onChange={(value) => onUpdate({ acquisitionNotes: value })}
      />
      <FormField
        label="Date Sold"
        value={gear.dateSold}
        isEditing={isEditing}
        type="date"
        onChange={(value) => onUpdate({ dateSold: value })}
      />
      <FormField
        label="Price Sold"
        value={gear.priceSold}
        isEditing={isEditing}
        type="number"
        onChange={(value) => onUpdate({ priceSold: value })}
      />
      <FormField
        label="Sale Notes"
        value={gear.saleNotes}
        isEditing={isEditing}
        type="textarea"
        onChange={(value) => onUpdate({ saleNotes: value })}
      />
    </div>
  );
}; 
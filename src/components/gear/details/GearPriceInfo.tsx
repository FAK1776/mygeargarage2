import React from 'react';
import { BaseGear } from '../../../types/gear';
import { FormField } from '../../common/FormField';

interface GearPriceInfoProps {
  gear: BaseGear;
  isEditing: boolean;
  onUpdate: (updates: Partial<BaseGear>) => void;
}

export const GearPriceInfo: React.FC<GearPriceInfoProps> = ({ gear, isEditing, onUpdate }) => {
  const formatPrice = (price: number | undefined) => {
    if (!price) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="grid gap-2">
      <FormField
        label="Date Acquired"
        value={gear.dateAcquired}
        type="date"
        isEditing={isEditing}
        onChange={(value) => onUpdate({ dateAcquired: value })}
      />
      <FormField
        label="Price Paid"
        value={isEditing ? gear.pricePaid : formatPrice(gear.pricePaid)}
        type={isEditing ? "number" : "text"}
        isEditing={isEditing}
        onChange={(value) => onUpdate({ pricePaid: Number(value) })}
      />
      <FormField
        label="Acquisition Notes"
        value={gear.acquisitionNotes}
        type="textarea"
        isEditing={isEditing}
        onChange={(value) => onUpdate({ acquisitionNotes: value })}
      />
      <FormField
        label="Date Sold"
        value={gear.dateSold}
        type="date"
        isEditing={isEditing}
        onChange={(value) => onUpdate({ dateSold: value })}
      />
      <FormField
        label="Price Sold"
        value={isEditing ? gear.priceSold : formatPrice(gear.priceSold)}
        type={isEditing ? "number" : "text"}
        isEditing={isEditing}
        onChange={(value) => onUpdate({ priceSold: Number(value) })}
      />
      <FormField
        label="Sale Notes"
        value={gear.saleNotes}
        type="textarea"
        isEditing={isEditing}
        onChange={(value) => onUpdate({ saleNotes: value })}
      />
    </div>
  );
}; 
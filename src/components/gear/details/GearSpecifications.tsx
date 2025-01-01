import React from 'react';
import { BaseGear, GuitarSpecs } from '../../../types/gear';

interface GearSpecificationsProps {
  gear: BaseGear;
  specs: GuitarSpecs;
  isEditMode: boolean;
  onSpecUpdate: (category: string, subcategory: string | null, field: string, value: string | boolean) => void;
}

export const GearSpecifications: React.FC<GearSpecificationsProps> = ({
  gear,
  specs,
  isEditMode,
  onSpecUpdate,
}) => {
  const renderField = (category: string, subcategory: string | null, field: string, label: string, type: 'text' | 'boolean' = 'text') => {
    const value = subcategory
      ? specs?.[category]?.[subcategory]?.[field]
      : specs?.[category]?.[field];

    // Don't render empty fields unless in edit mode
    if (!isEditMode && !value) return null;

    return (
      <div key={`${category}-${subcategory}-${field}`} className="grid grid-cols-2 gap-4 mb-2">
        <div className="text-gray-600">{label}:</div>
        <div>
          {isEditMode ? (
            type === 'boolean' ? (
              <input
                type="checkbox"
                checked={!!value}
                onChange={(e) => onSpecUpdate(category, subcategory, field, e.target.checked)}
                className="h-4 w-4 text-[#EE5430] rounded focus:ring-[#EE5430]"
              />
            ) : (
              <input
                type="text"
                value={value || ''}
                onChange={(e) => onSpecUpdate(category, subcategory, field, e.target.value)}
                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-[#EE5430]"
              />
            )
          ) : (
            <span className="text-gray-900">
              {type === 'boolean' ? (value ? 'Yes' : 'No') : value}
            </span>
          )}
        </div>
      </div>
    );
  };

  // Helper function to check if a field has data
  const hasValue = (value: any) => {
    if (typeof value === 'boolean') return true;
    return value !== undefined && value !== null && value !== '';
  };

  // Helper function to check if a category or subcategory has any data
  const hasData = (fields: Array<{ field: string; label: string; type?: 'text' | 'boolean' }>, category: string, subcategory: string | null = null) => {
    return fields.some(({ field }) => {
      const value = subcategory
        ? specs?.[category]?.[subcategory]?.[field]
        : specs?.[category]?.[field];
      return hasValue(value);
    });
  };

  const categories = [
    {
      title: 'Overview',
      fields: [
        { field: 'manufacturer', label: 'Manufacturer' },
        { field: 'model', label: 'Model' },
        { field: 'bodySizeShape', label: 'Body Size / Shape' },
        { field: 'series', label: 'Series' },
        { field: 'buildType', label: 'Build Type' },
        { field: 'topMaterial', label: 'Top Material' },
        { field: 'bodyMaterial', label: 'Body Material' },
        { field: 'scaleLength', label: 'Scale Length' },
        { field: 'nutWidth', label: 'Nut Width' },
        { field: 'neckShapeProfile', label: 'Neck Shape Profile' },
        { field: 'neckTypeConstruction', label: 'Neck Type Construction' },
        { field: 'pickupConfiguration', label: 'Pickup Configuration' },
        { field: 'countryOfOrigin', label: 'Country Of Origin' },
        { field: 'serialNumber', label: 'Serial Number' }
      ]
    },
    {
      title: 'Top',
      fields: [
        { field: 'color', label: 'Color' },
        { field: 'finish', label: 'Finish' },
        { field: 'binding', label: 'Binding' },
        { field: 'inlayMaterial', label: 'Inlay Material' },
        { field: 'detail', label: 'Detail' },
        { field: 'bridgeStyle', label: 'Bridge Style' },
        { field: 'rosette', label: 'Rosette' },
        { field: 'bridgeStringSpacing', label: 'Bridge String Spacing' },
        { field: 'bridgeMaterial', label: 'Bridge Material' },
        { field: 'bridgePinMaterial', label: 'Bridge Pin Material' },
        { field: 'bridgePinDots', label: 'Bridge Pin Dots' },
        { field: 'saddle', label: 'Saddle' },
        { field: 'saddleRadius', label: 'Saddle Radius' }
      ]
    },
    {
      title: 'Body',
      subcategories: [
        {
          title: 'Design',
          fields: [
            { field: 'color', label: 'Body Color (Back & Sides)' },
            { field: 'finish', label: 'Body Finish (Back & Sides)' },
            { field: 'binding', label: 'Body Binding' },
            { field: 'backPurfling', label: 'Back Purfling' },
            { field: 'backInlayMaterial', label: 'Back Inlay Material' },
            { field: 'backDetail', label: 'Back Detail' },
            { field: 'sideDetail', label: 'Side Detail' },
            { field: 'sideInlayMaterial', label: 'Side Inlay Material' },
            { field: 'endpiece', label: 'Endpiece' },
            { field: 'endpieceInlay', label: 'Endpiece Inlay' },
            { field: 'heelcap', label: 'Heelcap' }
          ]
        },
        {
          title: 'Bracing',
          fields: [
            { field: 'bodyBracing', label: 'Body Bracing' },
            { field: 'bracingPattern', label: 'Bracing Pattern' },
            { field: 'braceShape', label: 'Brace Shape' },
            { field: 'braceMaterial', label: 'Brace Material' },
            { field: 'braceSize', label: 'Brace Size' }
          ]
        },
        {
          title: 'Dimensions',
          fields: [
            { field: 'bodyDepth', label: 'Body Depth' },
            { field: 'upperBoutWidth', label: 'Upper Bout Width' },
            { field: 'upperBoutDepth', label: 'Upper Bout Depth' },
            { field: 'lowerBoutWidth', label: 'Lower Bout Width' },
            { field: 'lowerBoutDepth', label: 'Lower Bout Depth' }
          ]
        }
      ]
    },
    {
      title: 'Neck & Headstock',
      subcategories: [
        {
          title: 'Neck',
          fields: [
            { field: 'taper', label: 'Taper' },
            { field: 'material', label: 'Material' },
            { field: 'color', label: 'Color' },
            { field: 'finish', label: 'Finish' },
            { field: 'binding', label: 'Binding' },
            { field: 'numberOfFrets', label: 'Number of Frets' },
            { field: 'joinsBodyAt', label: 'Joins Body At' },
            { field: 'sideDots', label: 'Side Dots' },
            { field: 'trussRodType', label: 'Truss Rod Type' },
            { field: 'nutMaterial', label: 'Nut Material' }
          ]
        },
        {
          title: 'Fingerboard',
          fields: [
            { field: 'material', label: 'Material' },
            { field: 'radius', label: 'Radius' },
            { field: 'widthAt12thFret', label: 'Width at 12th Fret' },
            { field: 'inlayStyle', label: 'Inlay Style' },
            { field: 'inlayMaterial', label: 'Inlay Material' },
            { field: 'bindingMaterial', label: 'Binding Material' },
            { field: 'rolledEdges', label: 'Rolled Edges' },
            { field: 'fretSize', label: 'Fret Size' },
            { field: 'fretMarkerStyle', label: 'Fret Marker Style' }
          ]
        },
        {
          title: 'Headstock',
          fields: [
            { field: 'shape', label: 'Shape' },
            { field: 'plateMaterial', label: 'Plate Material' },
            { field: 'logoStyle', label: 'Logo Style' },
            { field: 'bindingMaterial', label: 'Binding Material' },
            { field: 'detail', label: 'Detail' }
          ]
        }
      ]
    },
    {
      title: 'Electronics',
      fields: [
        { field: 'acousticPickup', label: 'Acoustic Pickup' },
        { field: 'numberOfPickups', label: 'Number of Pickups' },
        { field: 'bridgePickup', label: 'Bridge Pickup' },
        { field: 'middlePickup', label: 'Middle Pickup' },
        { field: 'neckPickup', label: 'Neck Pickup' },
        { field: 'pickupColor', label: 'Pickup Color' },
        { field: 'controls', label: 'Controls' },
        { field: 'pickupSwitching', label: 'Pickup Switching' },
        { field: 'outputType', label: 'Output Type' },
        { field: 'specialElectronics', label: 'Special Electronics' }
      ]
    },
    {
      title: 'Hardware',
      fields: [
        { field: 'bridge', label: 'Bridge' },
        { field: 'finish', label: 'Finish' },
        { field: 'tuningMachines', label: 'Tuning Machines' },
        { field: 'tuningMachineKnobs', label: 'Tuning Machine Knobs' },
        { field: 'tailpiece', label: 'Tailpiece' },
        { field: 'pickguard', label: 'Pickguard' },
        { field: 'pickguardInlay', label: 'Pickguard Inlay' },
        { field: 'controlKnobs', label: 'Control Knobs' },
        { field: 'switchTip', label: 'Switch Tip' },
        { field: 'neckPlate', label: 'Neck Plate' },
        { field: 'strapButtons', label: 'Strap Buttons' }
      ]
    },
    {
      title: 'Miscellaneous',
      fields: [
        { field: 'pleked', label: 'Pleked', type: 'boolean' },
        { field: 'label', label: 'Label' },
        { field: 'case', label: 'Case' },
        { field: 'recommendedStrings', label: 'Recommended Strings' },
        { field: 'weight', label: 'Weight' },
        { field: 'orientation', label: 'Orientation' },
        { field: 'comments', label: 'Comments' }
      ]
    }
  ];

  return (
    <div className="flex-1 space-y-8">
      {categories.map(category => {
        // Skip categories with no data unless in edit mode
        if (!isEditMode && !category.subcategories && !hasData(category.fields, category.title.toLowerCase())) {
          return null;
        }

        return (
          <div key={category.title} className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">{category.title}</h2>
            {category.subcategories ? (
              // Render subcategories
              <div className="space-y-6">
                {category.subcategories.map(subcategory => {
                  // Skip subcategories with no data unless in edit mode
                  if (!isEditMode && !hasData(subcategory.fields, category.title.toLowerCase(), subcategory.title.toLowerCase())) {
                    return null;
                  }

                  return (
                    <div key={subcategory.title} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{subcategory.title}</h3>
                      <div className="space-y-2">
                        {subcategory.fields.map(({ field, label, type }) => 
                          renderField(
                            category.title.toLowerCase(),
                            subcategory.title.toLowerCase(),
                            field,
                            label,
                            type
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Render fields directly
              <div className="space-y-2">
                {category.fields.map(({ field, label, type }) => 
                  renderField(
                    category.title.toLowerCase(),
                    null,
                    field,
                    label,
                    type
                  )
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}; 
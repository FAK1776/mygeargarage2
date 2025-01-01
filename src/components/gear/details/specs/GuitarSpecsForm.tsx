import React from 'react';
import { GuitarSpecs } from '../../../../types/gear';
import { FormField } from '../../../common/FormField';

interface GuitarSpecsFormProps {
  specs: GuitarSpecs;
  isEditing: boolean;
  onUpdate: (updates: Partial<GuitarSpecs>) => void;
}

export const GuitarSpecsForm: React.FC<GuitarSpecsFormProps> = ({
  specs,
  isEditing,
  onUpdate,
}) => {
  const handleSpecUpdate = (
    category: keyof GuitarSpecs,
    subcategory: string | null,
    field: string,
    value: string | boolean
  ) => {
    const updatedSpecs = { ...specs };
    
    if (subcategory) {
      updatedSpecs[category] = {
        ...updatedSpecs[category],
        [subcategory]: {
          ...updatedSpecs[category][subcategory],
          [field]: value
        }
      };
    } else {
      updatedSpecs[category] = {
        ...updatedSpecs[category],
        [field]: value
      };
    }
    
    onUpdate(updatedSpecs);
  };

  const renderSpecificationSection = (
    title: string,
    category: keyof GuitarSpecs,
    fields: { [key: string]: any },
    subcategory: string | null = null
  ) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(fields).map(([field, value]) => (
          <FormField
            key={`${category}-${subcategory}-${field}`}
            label={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            value={value?.toString() || ''}
            isEditing={isEditing}
            onChange={(newValue) => handleSpecUpdate(category, subcategory, field, newValue)}
            type={typeof value === 'boolean' ? 'checkbox' : 'text'}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Overview Section */}
      {specs.overview && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Overview</h2>
          {renderSpecificationSection('Basic Information', 'overview', specs.overview)}
        </div>
      )}

      {/* Top Section */}
      {specs.top && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Top</h2>
          {renderSpecificationSection('Top Details', 'top', specs.top)}
        </div>
      )}

      {/* Body Section */}
      {specs.body && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Body</h2>
          
          {/* Design Subsection */}
          {specs.body.design && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Design</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Body Color (Back & Sides)"
                  value={specs.body.design.color || ''}
                  isEditing={isEditing}
                  onChange={(value) => handleSpecUpdate('body', 'design', 'color', value)}
                />
                <FormField
                  label="Body Finish (Back & Sides)"
                  value={specs.body.design.finish || ''}
                  isEditing={isEditing}
                  onChange={(value) => handleSpecUpdate('body', 'design', 'finish', value)}
                />
                <FormField
                  label="Body Binding"
                  value={specs.body.design.binding || ''}
                  isEditing={isEditing}
                  onChange={(value) => handleSpecUpdate('body', 'design', 'binding', value)}
                />
                <FormField
                  label="Back Purfling/Strip"
                  value={specs.body.design.backPurfling || ''}
                  isEditing={isEditing}
                  onChange={(value) => handleSpecUpdate('body', 'design', 'backPurfling', value)}
                />
                <FormField
                  label="Back Inlay Material"
                  value={specs.body.design.backInlayMaterial || ''}
                  isEditing={isEditing}
                  onChange={(value) => handleSpecUpdate('body', 'design', 'backInlayMaterial', value)}
                />
                <FormField
                  label="Back Detail"
                  value={specs.body.design.backDetail || ''}
                  isEditing={isEditing}
                  onChange={(value) => handleSpecUpdate('body', 'design', 'backDetail', value)}
                />
                <FormField
                  label="Side Detail"
                  value={specs.body.design.sideDetail || ''}
                  isEditing={isEditing}
                  onChange={(value) => handleSpecUpdate('body', 'design', 'sideDetail', value)}
                />
                <FormField
                  label="Side Inlay Material"
                  value={specs.body.design.sideInlayMaterial || ''}
                  isEditing={isEditing}
                  onChange={(value) => handleSpecUpdate('body', 'design', 'sideInlayMaterial', value)}
                />
                <FormField
                  label="Endpiece"
                  value={specs.body.design.endpiece || ''}
                  isEditing={isEditing}
                  onChange={(value) => handleSpecUpdate('body', 'design', 'endpiece', value)}
                />
                <FormField
                  label="Endpiece Inlay"
                  value={specs.body.design.endpieceInlay || ''}
                  isEditing={isEditing}
                  onChange={(value) => handleSpecUpdate('body', 'design', 'endpieceInlay', value)}
                />
                <FormField
                  label="Heelcap"
                  value={specs.body.design.heelcap || ''}
                  isEditing={isEditing}
                  onChange={(value) => handleSpecUpdate('body', 'design', 'heelcap', value)}
                />
              </div>
            </div>
          )}

          {/* Bracing Subsection */}
          {specs.body.bracing && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bracing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Body Bracing"
                  value={specs.body.bracing.bodyBracing || ''}
                  isEditing={isEditing}
                  onChange={(value) => handleSpecUpdate('body', 'bracing', 'bodyBracing', value)}
                />
                <FormField
                  label="Bracing Pattern"
                  value={specs.body.bracing.bracingPattern || ''}
                  isEditing={isEditing}
                  onChange={(value) => handleSpecUpdate('body', 'bracing', 'bracingPattern', value)}
                />
                <FormField
                  label="Brace Shape"
                  value={specs.body.bracing.braceShape || ''}
                  isEditing={isEditing}
                  onChange={(value) => handleSpecUpdate('body', 'bracing', 'braceShape', value)}
                />
                <FormField
                  label="Brace Material"
                  value={specs.body.bracing.braceMaterial || ''}
                  isEditing={isEditing}
                  onChange={(value) => handleSpecUpdate('body', 'bracing', 'braceMaterial', value)}
                />
                <FormField
                  label="Brace Size"
                  value={specs.body.bracing.braceSize || ''}
                  isEditing={isEditing}
                  onChange={(value) => handleSpecUpdate('body', 'bracing', 'braceSize', value)}
                />
              </div>
            </div>
          )}

          {/* Dimensions Subsection */}
          {specs.body.dimensions && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dimensions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Body Depth"
                  value={specs.body.dimensions.bodyDepth || ''}
                  isEditing={isEditing}
                  onChange={(value) => handleSpecUpdate('body', 'dimensions', 'bodyDepth', value)}
                />
                <FormField
                  label="Upper Bout Width"
                  value={specs.body.dimensions.upperBoutWidth || ''}
                  isEditing={isEditing}
                  onChange={(value) => handleSpecUpdate('body', 'dimensions', 'upperBoutWidth', value)}
                />
                <FormField
                  label="Upper Bout Depth"
                  value={specs.body.dimensions.upperBoutDepth || ''}
                  isEditing={isEditing}
                  onChange={(value) => handleSpecUpdate('body', 'dimensions', 'upperBoutDepth', value)}
                />
                <FormField
                  label="Lower Bout Width"
                  value={specs.body.dimensions.lowerBoutWidth || ''}
                  isEditing={isEditing}
                  onChange={(value) => handleSpecUpdate('body', 'dimensions', 'lowerBoutWidth', value)}
                />
                <FormField
                  label="Lower Bout Depth"
                  value={specs.body.dimensions.lowerBoutDepth || ''}
                  isEditing={isEditing}
                  onChange={(value) => handleSpecUpdate('body', 'dimensions', 'lowerBoutDepth', value)}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Neck & Headstock Section */}
      {specs.neckAndHeadstock && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Neck & Headstock</h2>
          {specs.neckAndHeadstock.neck && renderSpecificationSection('Neck', 'neckAndHeadstock', specs.neckAndHeadstock.neck, 'neck')}
          {specs.neckAndHeadstock.fingerboard && renderSpecificationSection('Fingerboard', 'neckAndHeadstock', specs.neckAndHeadstock.fingerboard, 'fingerboard')}
          {specs.neckAndHeadstock.headstock && renderSpecificationSection('Headstock', 'neckAndHeadstock', specs.neckAndHeadstock.headstock, 'headstock')}
        </div>
      )}

      {/* Electronics Section */}
      {specs.electronics && renderSpecificationSection('Electronics', 'electronics', specs.electronics)}

      {/* Hardware Section */}
      {specs.hardware && renderSpecificationSection('Hardware', 'hardware', specs.hardware)}

      {/* Miscellaneous Section */}
      {specs.miscellaneous && renderSpecificationSection('Miscellaneous', 'miscellaneous', specs.miscellaneous)}
    </div>
  );
}; 
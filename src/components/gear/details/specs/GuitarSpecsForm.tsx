import React from 'react';
import { GuitarSpecs } from '../../../../types/gear';
import { FormField } from '../../../common/FormField';

interface GuitarSpecsFormProps {
  specs: GuitarSpecs;
  isEditing: boolean;
  onUpdate: (specs: Partial<GuitarSpecs>) => void;
}

export const GuitarSpecsForm: React.FC<GuitarSpecsFormProps> = ({ specs, isEditing, onUpdate }) => {
  const handleBodyUpdate = (updates: Partial<GuitarSpecs['body']>) => {
    onUpdate({ body: { ...specs.body, ...updates } });
  };

  const handleNeckUpdate = (updates: Partial<GuitarSpecs['neck']>) => {
    onUpdate({ neck: { ...specs.neck, ...updates } });
  };

  const handleHeadstockUpdate = (updates: Partial<GuitarSpecs['headstock']>) => {
    onUpdate({ headstock: { ...specs.headstock, ...updates } });
  };

  const handleHardwareUpdate = (updates: Partial<GuitarSpecs['hardware']>) => {
    onUpdate({ hardware: { ...specs.hardware, ...updates } });
  };

  const handleElectronicsUpdate = (updates: Partial<GuitarSpecs['electronics']>) => {
    onUpdate({ electronics: { ...specs.electronics, ...updates } });
  };

  const handleExtrasUpdate = (updates: Partial<GuitarSpecs['extras']>) => {
    onUpdate({ extras: { ...specs.extras, ...updates } });
  };

  return (
    <div className="space-y-8">
      {/* Body */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Body</h3>
        <div className="space-y-4">
          <FormField
            label="Shape"
            value={specs.body?.shape}
            isEditing={isEditing}
            onChange={(value) => handleBodyUpdate({ shape: value })}
          />
          <FormField
            label="Type"
            value={specs.body?.type}
            isEditing={isEditing}
            onChange={(value) => handleBodyUpdate({ type: value })}
          />
          <FormField
            label="Material"
            value={specs.body?.material}
            isEditing={isEditing}
            onChange={(value) => handleBodyUpdate({ material: value })}
          />
          <FormField
            label="Top/Back"
            value={specs.body?.topBack}
            isEditing={isEditing}
            onChange={(value) => handleBodyUpdate({ topBack: value })}
          />
          <FormField
            label="Finish"
            value={specs.body?.finish}
            isEditing={isEditing}
            onChange={(value) => handleBodyUpdate({ finish: value })}
          />
          <FormField
            label="Depth"
            value={specs.body?.depth}
            isEditing={isEditing}
            onChange={(value) => handleBodyUpdate({ depth: value })}
          />
          <FormField
            label="Binding"
            value={specs.body?.binding}
            isEditing={isEditing}
            onChange={(value) => handleBodyUpdate({ binding: value })}
          />
          <FormField
            label="Bracing"
            value={specs.body?.bracing}
            isEditing={isEditing}
            onChange={(value) => handleBodyUpdate({ bracing: value })}
          />
          <FormField
            label="Cutaway"
            value={specs.body?.cutaway}
            isEditing={isEditing}
            onChange={(value) => handleBodyUpdate({ cutaway: value })}
          />
          <FormField
            label="Top Color"
            value={specs.body?.topColor}
            isEditing={isEditing}
            onChange={(value) => handleBodyUpdate({ topColor: value })}
          />
        </div>
      </div>

      {/* Neck */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Neck</h3>
        <div className="space-y-4">
          <FormField
            label="Material"
            value={specs.neck?.material}
            isEditing={isEditing}
            onChange={(value) => handleNeckUpdate({ material: value })}
          />
          <FormField
            label="Shape"
            value={specs.neck?.shape}
            isEditing={isEditing}
            onChange={(value) => handleNeckUpdate({ shape: value })}
          />
          <FormField
            label="Thickness"
            value={specs.neck?.thickness}
            isEditing={isEditing}
            onChange={(value) => handleNeckUpdate({ thickness: value })}
          />
          <FormField
            label="Construction"
            value={specs.neck?.construction}
            isEditing={isEditing}
            onChange={(value) => handleNeckUpdate({ construction: value })}
          />
          <FormField
            label="Finish"
            value={specs.neck?.finish}
            isEditing={isEditing}
            onChange={(value) => handleNeckUpdate({ finish: value })}
          />
          <FormField
            label="Scale Length"
            value={specs.neck?.scaleLength}
            isEditing={isEditing}
            onChange={(value) => handleNeckUpdate({ scaleLength: value })}
          />
          <FormField
            label="Fingerboard Material"
            value={specs.neck?.fingerboardMaterial}
            isEditing={isEditing}
            onChange={(value) => handleNeckUpdate({ fingerboardMaterial: value })}
          />
          <FormField
            label="Fingerboard Radius"
            value={specs.neck?.fingerboardRadius}
            isEditing={isEditing}
            onChange={(value) => handleNeckUpdate({ fingerboardRadius: value })}
          />
          <FormField
            label="Number of Frets"
            value={specs.neck?.numberOfFrets}
            isEditing={isEditing}
            type="number"
            onChange={(value) => handleNeckUpdate({ numberOfFrets: value })}
          />
          <FormField
            label="Fret Size"
            value={specs.neck?.fretSize}
            isEditing={isEditing}
            onChange={(value) => handleNeckUpdate({ fretSize: value })}
          />
          <FormField
            label="Nut Material"
            value={specs.neck?.nutMaterial}
            isEditing={isEditing}
            onChange={(value) => handleNeckUpdate({ nutMaterial: value })}
          />
          <FormField
            label="Nut Width"
            value={specs.neck?.nutWidth}
            isEditing={isEditing}
            onChange={(value) => handleNeckUpdate({ nutWidth: value })}
          />
          <FormField
            label="Fingerboard Inlays"
            value={specs.neck?.fingerboardInlays}
            isEditing={isEditing}
            onChange={(value) => handleNeckUpdate({ fingerboardInlays: value })}
          />
          <FormField
            label="Binding"
            value={specs.neck?.binding}
            isEditing={isEditing}
            onChange={(value) => handleNeckUpdate({ binding: value })}
          />
          <FormField
            label="Side Dots"
            value={specs.neck?.sideDots}
            isEditing={isEditing}
            onChange={(value) => handleNeckUpdate({ sideDots: value })}
          />
        </div>
      </div>

      {/* Headstock */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Headstock</h3>
        <div className="space-y-4">
          <FormField
            label="Shape"
            value={specs.headstock?.shape}
            isEditing={isEditing}
            onChange={(value) => handleHeadstockUpdate({ shape: value })}
          />
          <FormField
            label="Binding"
            value={specs.headstock?.binding}
            isEditing={isEditing}
            onChange={(value) => handleHeadstockUpdate({ binding: value })}
          />
          <FormField
            label="Tuning Machines"
            value={specs.headstock?.tuningMachines}
            isEditing={isEditing}
            onChange={(value) => handleHeadstockUpdate({ tuningMachines: value })}
          />
          <FormField
            label="Headplate Logo"
            value={specs.headstock?.headplateLogo}
            isEditing={isEditing}
            onChange={(value) => handleHeadstockUpdate({ headplateLogo: value })}
          />
        </div>
      </div>

      {/* Hardware */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Hardware</h3>
        <div className="space-y-4">
          <FormField
            label="Bridge"
            value={specs.hardware?.bridge}
            isEditing={isEditing}
            onChange={(value) => handleHardwareUpdate({ bridge: value })}
          />
          <FormField
            label="Tailpiece"
            value={specs.hardware?.tailpiece}
            isEditing={isEditing}
            onChange={(value) => handleHardwareUpdate({ tailpiece: value })}
          />
          <FormField
            label="Finish"
            value={specs.hardware?.finish}
            isEditing={isEditing}
            onChange={(value) => handleHardwareUpdate({ finish: value })}
          />
          <FormField
            label="Pickguard"
            value={specs.hardware?.pickguard}
            isEditing={isEditing}
            onChange={(value) => handleHardwareUpdate({ pickguard: value })}
          />
          <FormField
            label="Knobs"
            value={specs.hardware?.knobs}
            isEditing={isEditing}
            onChange={(value) => handleHardwareUpdate({ knobs: value })}
          />
          <FormField
            label="Strap Buttons"
            value={specs.hardware?.strapButtons}
            isEditing={isEditing}
            onChange={(value) => handleHardwareUpdate({ strapButtons: value })}
          />
        </div>
      </div>

      {/* Electronics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Electronics</h3>
        <div className="space-y-4">
          <FormField
            label="Pickup System"
            value={specs.electronics?.pickupSystem}
            isEditing={isEditing}
            onChange={(value) => handleElectronicsUpdate({ pickupSystem: value })}
          />
          <FormField
            label="Neck Pickup"
            value={specs.electronics?.neckPickup}
            isEditing={isEditing}
            onChange={(value) => handleElectronicsUpdate({ neckPickup: value })}
          />
          <FormField
            label="Bridge Pickup"
            value={specs.electronics?.bridgePickup}
            isEditing={isEditing}
            onChange={(value) => handleElectronicsUpdate({ bridgePickup: value })}
          />
          <FormField
            label="Pickup Configuration"
            value={specs.electronics?.pickupConfiguration}
            isEditing={isEditing}
            onChange={(value) => handleElectronicsUpdate({ pickupConfiguration: value })}
          />
          <FormField
            label="Controls"
            value={specs.electronics?.controls}
            isEditing={isEditing}
            onChange={(value) => handleElectronicsUpdate({ controls: value })}
          />
          <FormField
            label="Pickup Switching"
            value={specs.electronics?.pickupSwitching}
            isEditing={isEditing}
            onChange={(value) => handleElectronicsUpdate({ pickupSwitching: value })}
          />
          <FormField
            label="Auxiliary Switching"
            value={specs.electronics?.auxiliarySwitching}
            isEditing={isEditing}
            onChange={(value) => handleElectronicsUpdate({ auxiliarySwitching: value })}
          />
        </div>
      </div>

      {/* Extras */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Extras</h3>
        <div className="space-y-4">
          <FormField
            label="Strings"
            value={specs.extras?.strings}
            isEditing={isEditing}
            onChange={(value) => handleExtrasUpdate({ strings: value })}
          />
          <FormField
            label="Case/Gig Bag"
            value={specs.extras?.caseOrGigBag}
            isEditing={isEditing}
            onChange={(value) => handleExtrasUpdate({ caseOrGigBag: value })}
          />
          <FormField
            label="Modifications/Repairs"
            value={specs.extras?.modificationsRepairs}
            isEditing={isEditing}
            type="textarea"
            onChange={(value) => handleExtrasUpdate({ modificationsRepairs: value })}
          />
          <FormField
            label="Unique Features"
            value={specs.extras?.uniqueFeatures}
            isEditing={isEditing}
            type="textarea"
            onChange={(value) => handleExtrasUpdate({ uniqueFeatures: value })}
          />
        </div>
      </div>
    </div>
  );
}; 
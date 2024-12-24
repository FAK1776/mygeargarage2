import React, { useState, useCallback, useRef, useEffect } from 'react';
import { BaseGear, GuitarSpecs } from '../../types/gear';
import { GearService } from '../../services/gearService';
import { useAuth } from '../../hooks/useAuth';
import { FaChevronLeft, FaChevronRight, FaTimes, FaTrash, FaUpload, FaImage } from 'react-icons/fa';

interface GearDetailsOverlayProps {
  gear: BaseGear;
  onClose: () => void;
  onUpdate: (updatedGear: BaseGear) => void;
}

export const GearDetailsOverlay: React.FC<GearDetailsOverlayProps> = ({ gear, onClose, onUpdate }) => {
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gearService = new GearService();

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        const updatedGear = await gearService.addImage(user!.uid, gear.id, file);
        onUpdate(updatedGear);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  }, [gear.id, user, onUpdate]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        const updatedGear = await gearService.addImage(user!.uid, gear.id, file);
        onUpdate(updatedGear);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const handleDeleteImage = async () => {
    if (!gear.images || gear.images.length === 0) return;

    try {
      const updatedGear = await gearService.deleteImage(user!.uid, gear.id, currentImageIndex);
      onUpdate(updatedGear);
      if (currentImageIndex >= updatedGear.images.length) {
        setCurrentImageIndex(Math.max(0, updatedGear.images.length - 1));
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const nextImage = () => {
    if (!gear.images || gear.images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % gear.images.length);
  };

  const prevImage = () => {
    if (!gear.images || gear.images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev - 1 + gear.images.length) % gear.images.length);
  };

  const renderSpecRow = (label: string, value: string | undefined) => {
    if (!value || value === 'N/A') return null;
    return (
      <div className="flex justify-between py-1 border-b border-gray-100">
        <span className="text-gray-600 min-w-[120px]">{label}:</span>
        <span className="text-gray-900 font-medium text-right flex-1 ml-4">{value}</span>
      </div>
    );
  };

  const specs = gear.specs as GuitarSpecs;

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
        </div>

        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left column - Images */}
            <div className="lg:w-1/2">
              <h2 className="text-2xl font-bold mb-4">
                {gear.make} {gear.model}{gear.year ? ` (${gear.year})` : ''}
              </h2>
              <div 
                className={`relative aspect-square mb-4 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  isDragging 
                    ? 'border-dashed border-blue-500 bg-blue-50 scale-102' 
                    : gear.images && gear.images.length > 0 
                      ? 'border-transparent'
                      : 'border-dashed border-gray-300 hover:border-blue-500'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {gear.images && gear.images.length > 0 ? (
                  <>
                    <img
                      src={gear.images[currentImageIndex]}
                      alt={`${gear.make} ${gear.model}`}
                      className="w-full h-full object-contain transition-opacity duration-300"
                    />
                    <button
                      onClick={handleDeleteImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-110"
                      title="Delete image"
                    >
                      <FaTrash size={16} />
                    </button>
                    {gear.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all duration-300 transform hover:scale-110"
                        >
                          <FaChevronLeft size={20} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all duration-300 transform hover:scale-110"
                        >
                          <FaChevronRight size={20} />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    <FaImage size={48} className="mb-2" />
                    <p className="text-center px-4">
                      <span className="font-medium">Drop images here</span>
                      <br />
                      or click to upload
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center transition-all duration-300 transform hover:scale-105"
                >
                  <FaUpload className="mr-2" />
                  Choose Files
                </button>
              </div>
            </div>

            {/* Right column - Specifications */}
            <div className="lg:w-1/2 space-y-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
              {/* General Information */}
              <div>
                <h3 className="text-xl font-semibold mb-3">General Information</h3>
                <div className="space-y-1">
                  {renderSpecRow('Make', gear.make)}
                  {renderSpecRow('Model', gear.model)}
                  {renderSpecRow('Year', gear.year)}
                  {renderSpecRow('Model Number', gear.modelNumber)}
                  {renderSpecRow('Series', gear.series)}
                  {renderSpecRow('Serial Number', gear.serialNumber)}
                  {renderSpecRow('Orientation', gear.orientation)}
                  {renderSpecRow('Number of Strings', gear.numberOfStrings)}
                  {renderSpecRow('Weight', gear.weight)}
                </div>
              </div>

              {/* Body */}
              {specs?.body && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Body</h3>
                  <div className="space-y-1">
                    {renderSpecRow('Shape', specs.body.shape)}
                    {renderSpecRow('Type', specs.body.type)}
                    {renderSpecRow('Material', specs.body.material)}
                    {renderSpecRow('Top/Back', specs.body.topBack)}
                    {renderSpecRow('Finish', specs.body.finish)}
                    {renderSpecRow('Depth', specs.body.depth)}
                    {renderSpecRow('Binding', specs.body.binding)}
                    {renderSpecRow('Bracing', specs.body.bracing)}
                    {renderSpecRow('Cutaway', specs.body.cutaway)}
                    {renderSpecRow('Top Color', specs.body.topColor)}
                  </div>
                </div>
              )}

              {/* Neck */}
              {specs?.neck && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Neck</h3>
                  <div className="space-y-1">
                    {renderSpecRow('Material', specs.neck.material)}
                    {renderSpecRow('Shape', specs.neck.shape)}
                    {renderSpecRow('Thickness', specs.neck.thickness)}
                    {renderSpecRow('Construction', specs.neck.construction)}
                    {renderSpecRow('Finish', specs.neck.finish)}
                    {renderSpecRow('Scale Length', specs.neck.scaleLength)}
                    {renderSpecRow('Fingerboard Material', specs.neck.fingerboardMaterial)}
                    {renderSpecRow('Fingerboard Radius', specs.neck.fingerboardRadius)}
                    {renderSpecRow('Number of Frets', specs.neck.numberOfFrets)}
                    {renderSpecRow('Fret Size', specs.neck.fretSize)}
                    {renderSpecRow('Nut Material', specs.neck.nutMaterial)}
                    {renderSpecRow('Nut Width', specs.neck.nutWidth)}
                    {renderSpecRow('Fingerboard Inlays', specs.neck.fingerboardInlays)}
                    {renderSpecRow('Binding', specs.neck.binding)}
                    {renderSpecRow('Side Dots', specs.neck.sideDots)}
                  </div>
                </div>
              )}

              {/* Headstock */}
              {specs?.headstock && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Headstock</h3>
                  <div className="space-y-1">
                    {renderSpecRow('Shape', specs.headstock.shape)}
                    {renderSpecRow('Binding', specs.headstock.binding)}
                    {renderSpecRow('Tuning Machines', specs.headstock.tuningMachines)}
                    {renderSpecRow('Headplate Logo', specs.headstock.headplateLogo)}
                  </div>
                </div>
              )}

              {/* Hardware */}
              {specs?.hardware && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Hardware</h3>
                  <div className="space-y-1">
                    {renderSpecRow('Bridge', specs.hardware.bridge)}
                    {renderSpecRow('Tailpiece', specs.hardware.tailpiece)}
                    {renderSpecRow('Finish', specs.hardware.finish)}
                    {renderSpecRow('Pickguard', specs.hardware.pickguard)}
                    {renderSpecRow('Knobs', specs.hardware.knobs)}
                    {renderSpecRow('Strap Buttons', specs.hardware.strapButtons)}
                  </div>
                </div>
              )}

              {/* Electronics */}
              {specs?.electronics && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Electronics</h3>
                  <div className="space-y-1">
                    {renderSpecRow('Pickup System', specs.electronics.pickupSystem)}
                    {renderSpecRow('Neck Pickup', specs.electronics.neckPickup)}
                    {renderSpecRow('Bridge Pickup', specs.electronics.bridgePickup)}
                    {renderSpecRow('Pickup Configuration', specs.electronics.pickupConfiguration)}
                    {renderSpecRow('Controls', specs.electronics.controls)}
                    {renderSpecRow('Pickup Switching', specs.electronics.pickupSwitching)}
                    {renderSpecRow('Auxiliary Switching', specs.electronics.auxiliarySwitching)}
                  </div>
                </div>
              )}

              {/* Extras */}
              {specs?.extras && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Extras</h3>
                  <div className="space-y-1">
                    {renderSpecRow('Case/Gig Bag', specs.extras.caseOrGigBag)}
                    {renderSpecRow('Modifications/Repairs', specs.extras.modificationsRepairs)}
                    {renderSpecRow('Unique Features', specs.extras.uniqueFeatures)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
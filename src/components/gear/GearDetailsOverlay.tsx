import React, { useRef, useState, useEffect } from 'react';
import { BaseGear, GearStatus, GuitarSpecs, GearType } from '../../types/gear';
import { FaTimes, FaChevronLeft, FaChevronRight, FaTrash, FaUpload, FaImage, FaEdit, FaSave } from 'react-icons/fa';
import { GearService } from '../../services/gearService';
import { useAuth } from '../../hooks/useAuth';

interface GearDetailsOverlayProps {
  gear: BaseGear;
  onClose: () => void;
  onUpdate?: (gear: BaseGear) => void;
}

export const GearDetailsOverlay: React.FC<GearDetailsOverlayProps> = ({ gear, onClose, onUpdate }) => {
  const { user } = useAuth();
  const gearService = new GearService();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedGear, setEditedGear] = useState<BaseGear>(gear);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedGear);
    }
    setIsEditing(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        const updatedGear = await gearService.addImage(user!.uid, gear.id, file);
        if (onUpdate) {
          onUpdate(updatedGear);
        }
        setEditedGear(updatedGear);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        const updatedGear = await gearService.addImage(user!.uid, gear.id, file);
        if (onUpdate) {
          onUpdate(updatedGear);
        }
        setEditedGear(updatedGear);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const handleDeleteImage = async () => {
    if (!gear.images || gear.images.length === 0) return;

    try {
      const updatedGear = await gearService.deleteImage(user!.uid, gear.id, currentImageIndex);
      if (onUpdate) {
        onUpdate(updatedGear);
      }
      setEditedGear(updatedGear);
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

  const renderSpecRow = (label: string, value: string | undefined | null, field?: keyof BaseGear) => {
    if (!isEditing && (!value || value === 'N/A')) return null;
    
    if (isEditing && field) {
      if (field === 'type') {
        return (
          <div className="flex justify-between py-1 border-b border-gray-100">
            <label className="text-gray-600 min-w-[120px]">{label}:</label>
            <select
              value={editedGear.type}
              onChange={(e) => setEditedGear({ ...editedGear, type: e.target.value as GearType })}
              className="text-right flex-1 ml-4 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.values(GearType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        );
      }

      if (field === 'dateAcquired' || field === 'dateSold') {
        const dateValue = editedGear[field] ? new Date(editedGear[field] as Date).toISOString().split('T')[0] : '';
        return (
          <div className="flex justify-between py-1 border-b border-gray-100">
            <label className="text-gray-600 min-w-[120px]">{label}:</label>
            <input
              type="date"
              value={dateValue}
              onChange={(e) => {
                const newDate = e.target.value ? new Date(e.target.value) : undefined;
                setEditedGear({ ...editedGear, [field]: newDate });
              }}
              className="text-right flex-1 ml-4 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
      }
      
      if (field === 'pricePaid' || field === 'priceSold') {
        return (
          <div className="flex justify-between py-1 border-b border-gray-100">
            <label className="text-gray-600 min-w-[120px]">{label}:</label>
            <input
              type="number"
              step="0.01"
              value={editedGear[field] as number || ''}
              onChange={(e) => setEditedGear({ ...editedGear, [field]: parseFloat(e.target.value) || undefined })}
              className="text-right flex-1 ml-4 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
      }

      if (field === 'acquisitionNotes' || field === 'saleNotes') {
        return (
          <div className="flex justify-between py-1 border-b border-gray-100">
            <label className="text-gray-600 min-w-[120px]">{label}:</label>
            <textarea
              value={editedGear[field] as string || ''}
              onChange={(e) => setEditedGear({ ...editedGear, [field]: e.target.value })}
              className="text-right flex-1 ml-4 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
        );
      }

      return (
        <div className="flex justify-between py-1 border-b border-gray-100">
          <label className="text-gray-600 min-w-[120px]">{label}:</label>
          <input
            type="text"
            value={editedGear[field] as string || ''}
            onChange={(e) => setEditedGear({ ...editedGear, [field]: e.target.value })}
            className="text-right flex-1 ml-4 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      );
    }

    return (
      <div className="flex justify-between py-1 border-b border-gray-100">
        <span className="text-gray-600 min-w-[120px]">{label}:</span>
        <span className="text-gray-900 font-medium text-right flex-1 ml-4">{value}</span>
      </div>
    );
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return null;
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString();
    }
    return date.toLocaleDateString();
  };

  const formatPrice = (price: number | undefined) => {
    if (!price) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
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
                  {renderSpecRow('Make', gear.make, 'make')}
                  {renderSpecRow('Model', gear.model, 'model')}
                  {renderSpecRow('Year', gear.year, 'year')}
                  {renderSpecRow('Model Number', gear.modelNumber, 'modelNumber')}
                  {renderSpecRow('Series', gear.series, 'series')}
                  {renderSpecRow('Serial Number', gear.serialNumber, 'serialNumber')}
                  {renderSpecRow('Orientation', gear.orientation, 'orientation')}
                  {renderSpecRow('Number of Strings', gear.numberOfStrings, 'numberOfStrings')}
                  {renderSpecRow('Weight', gear.weight, 'weight')}
                  {renderSpecRow('Place of Origin', gear.placeOfOrigin, 'placeOfOrigin')}
                </div>
              </div>

              {/* Acquisition & Sale Details */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Acquisition & Sale Details</h3>
                <div className="space-y-1">
                  {renderSpecRow('Date Acquired', formatDate(gear.dateAcquired), 'dateAcquired')}
                  {renderSpecRow('Price Paid', formatPrice(gear.pricePaid), 'pricePaid')}
                  {renderSpecRow('Acquisition Notes', gear.acquisitionNotes, 'acquisitionNotes')}
                  {(isEditing || gear.status === GearStatus.Sold) && (
                    <>
                      {renderSpecRow('Date Sold', formatDate(gear.dateSold), 'dateSold')}
                      {renderSpecRow('Price Sold', formatPrice(gear.priceSold), 'priceSold')}
                      {renderSpecRow('Sale Notes', gear.saleNotes, 'saleNotes')}
                    </>
                  )}
                </div>
              </div>

              {/* Body */}
              {specs?.body && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Body</h3>
                  <div className="space-y-1">
                    {renderSpecRow('Shape', specs.body.shape, 'bodyShape')}
                    {renderSpecRow('Type', specs.body.type, 'bodyType')}
                    {renderSpecRow('Material', specs.body.material, 'bodyMaterial')}
                    {renderSpecRow('Top/Back', specs.body.topBack, 'bodyTopBack')}
                    {renderSpecRow('Finish', specs.body.finish, 'bodyFinish')}
                    {renderSpecRow('Depth', specs.body.depth, 'bodyDepth')}
                    {renderSpecRow('Binding', specs.body.binding, 'bodyBinding')}
                    {renderSpecRow('Bracing', specs.body.bracing, 'bodyBracing')}
                    {renderSpecRow('Cutaway', specs.body.cutaway, 'bodyCutaway')}
                    {renderSpecRow('Top Color', specs.body.topColor, 'bodyTopColor')}
                  </div>
                </div>
              )}

              {/* Neck */}
              {specs?.neck && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Neck</h3>
                  <div className="space-y-1">
                    {renderSpecRow('Material', specs.neck.material, 'neckMaterial')}
                    {renderSpecRow('Shape', specs.neck.shape, 'neckShape')}
                    {renderSpecRow('Thickness', specs.neck.thickness, 'neckThickness')}
                    {renderSpecRow('Construction', specs.neck.construction, 'neckConstruction')}
                    {renderSpecRow('Finish', specs.neck.finish, 'neckFinish')}
                    {renderSpecRow('Scale Length', specs.neck.scaleLength, 'neckScaleLength')}
                    {renderSpecRow('Fingerboard Material', specs.neck.fingerboardMaterial, 'neckFingerboardMaterial')}
                    {renderSpecRow('Fingerboard Radius', specs.neck.fingerboardRadius, 'neckFingerboardRadius')}
                    {renderSpecRow('Number of Frets', specs.neck.numberOfFrets, 'neckNumberOfFrets')}
                    {renderSpecRow('Fret Size', specs.neck.fretSize, 'neckFretSize')}
                    {renderSpecRow('Nut Material', specs.neck.nutMaterial, 'neckNutMaterial')}
                    {renderSpecRow('Nut Width', specs.neck.nutWidth, 'neckNutWidth')}
                    {renderSpecRow('Fingerboard Inlays', specs.neck.fingerboardInlays, 'neckFingerboardInlays')}
                    {renderSpecRow('Binding', specs.neck.binding, 'neckBinding')}
                    {renderSpecRow('Side Dots', specs.neck.sideDots, 'neckSideDots')}
                  </div>
                </div>
              )}

              {/* Headstock */}
              {specs?.headstock && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Headstock</h3>
                  <div className="space-y-1">
                    {renderSpecRow('Shape', specs.headstock.shape, 'headstockShape')}
                    {renderSpecRow('Binding', specs.headstock.binding, 'headstockBinding')}
                    {renderSpecRow('Tuning Machines', specs.headstock.tuningMachines, 'headstockTuningMachines')}
                    {renderSpecRow('Headplate Logo', specs.headstock.headplateLogo, 'headstockHeadplateLogo')}
                  </div>
                </div>
              )}

              {/* Hardware */}
              {specs?.hardware && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Hardware</h3>
                  <div className="space-y-1">
                    {renderSpecRow('Bridge', specs.hardware.bridge, 'hardwareBridge')}
                    {renderSpecRow('Tailpiece', specs.hardware.tailpiece, 'hardwareTailpiece')}
                    {renderSpecRow('Finish', specs.hardware.finish, 'hardwareFinish')}
                    {renderSpecRow('Pickguard', specs.hardware.pickguard, 'hardwarePickguard')}
                    {renderSpecRow('Knobs', specs.hardware.knobs, 'hardwareKnobs')}
                    {renderSpecRow('Strap Buttons', specs.hardware.strapButtons, 'hardwareStrapButtons')}
                  </div>
                </div>
              )}

              {/* Electronics */}
              {specs?.electronics && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Electronics</h3>
                  <div className="space-y-1">
                    {renderSpecRow('Pickup System', specs.electronics.pickupSystem, 'electronicsPickupSystem')}
                    {renderSpecRow('Neck Pickup', specs.electronics.neckPickup, 'electronicsNeckPickup')}
                    {renderSpecRow('Bridge Pickup', specs.electronics.bridgePickup, 'electronicsBridgePickup')}
                    {renderSpecRow('Pickup Configuration', specs.electronics.pickupConfiguration, 'electronicsPickupConfiguration')}
                    {renderSpecRow('Controls', specs.electronics.controls, 'electronicsControls')}
                    {renderSpecRow('Pickup Switching', specs.electronics.pickupSwitching, 'electronicsPickupSwitching')}
                    {renderSpecRow('Auxiliary Switching', specs.electronics.auxiliarySwitching, 'electronicsAuxiliarySwitching')}
                  </div>
                </div>
              )}

              {/* Extras */}
              {specs?.extras && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Extras</h3>
                  <div className="space-y-1">
                    {renderSpecRow('Strings', specs.extras.strings, 'extrasStrings')}
                    {renderSpecRow('Case/Gig Bag', specs.extras.caseOrGigBag, 'extrasCaseOrGigBag')}
                    {renderSpecRow('Modifications/Repairs', specs.extras.modificationsRepairs, 'extrasModificationsRepairs')}
                    {renderSpecRow('Unique Features', specs.extras.uniqueFeatures, 'extrasUniqueFeatures')}
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
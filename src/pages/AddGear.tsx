import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
import { GearService } from '../services/gearService';
import { GearType, GuitarSpecs, GearFormData, GearStatus } from '../types/gear';
import { GearSpecParser } from '../components/gear/GearSpecParser';

const gearService = new GearService();

const INITIAL_FORM_DATA: GearFormData = {
  type: GearType.Guitar,
  make: '',
  model: '',
  year: '',
  modelNumber: '',
  series: '',
  serialNumber: '',
  orientation: '',
  numberOfStrings: '',
  weight: '',
  description: '',
  images: [],
  status: GearStatus.Own,
  specs: {
    body: {
      shape: '',
      type: '',
      material: '',
      topBack: '',
      finish: '',
      depth: '',
      binding: '',
      bracing: '',
      cutaway: '',
      topColor: ''
    },
    neck: {
      material: '',
      shape: '',
      thickness: '',
      construction: '',
      finish: '',
      scaleLength: '',
      fingerboardMaterial: '',
      fingerboardRadius: '',
      numberOfFrets: '',
      fretSize: '',
      nutMaterial: '',
      nutWidth: '',
      fingerboardInlays: '',
      binding: '',
      sideDots: ''
    },
    headstock: {
      shape: '',
      binding: '',
      tuningMachines: '',
      headplateLogo: ''
    },
    hardware: {
      bridge: '',
      tailpiece: '',
      finish: '',
      pickguard: '',
      knobs: '',
      strapButtons: ''
    },
    electronics: {
      pickupSystem: '',
      neckPickup: '',
      bridgePickup: '',
      pickupConfiguration: '',
      controls: '',
      pickupSwitching: '',
      auxiliarySwitching: ''
    },
    extras: {
      strings: '',
      caseOrGigBag: '',
      modificationsRepairs: '',
      uniqueFeatures: ''
    }
  } as GuitarSpecs
};

export const AddGear = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState<GearFormData>(INITIAL_FORM_DATA);
  const [isManualEntry, setIsManualEntry] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecsChange = (category: keyof GuitarSpecs, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specs: {
        ...prev.specs,
        [category]: {
          ...prev.specs[category],
          [field]: value
        }
      }
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImageFiles(files);
      // Create preview URLs
      const urls = Array.from(files).map(file => URL.createObjectURL(file));
      setImageUrls(urls);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);

      // Create the gear without images first
      const newGear = await gearService.addGear(user.uid, formData);

      // Upload images if selected
      if (imageFiles) {
        for (let i = 0; i < imageFiles.length; i++) {
          await gearService.addImage(user.uid, newGear, imageFiles[i]);
        }
      }

      navigate('/');
    } catch (error) {
      console.error('Error adding gear:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-light text-gray-900 mb-4">Add New Gear</h1>
        
        <p className="text-gray-600 mb-8">
          Add your gear by either manually entering the details or by pasting the manufacturer's specifications. 
          The specification parser will automatically extract relevant information to save you time.
        </p>

        <div className="flex justify-start space-x-4 mb-8">
          <button
            onClick={() => setIsManualEntry(true)}
            className={`px-4 py-2 rounded transition-colors ${
              isManualEntry
                ? 'bg-[#EE5430] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Manual Entry
          </button>
          <button
            onClick={() => setIsManualEntry(false)}
            className={`px-4 py-2 rounded transition-colors ${
              !isManualEntry
                ? 'bg-[#EE5430] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Paste Specifications
          </button>
        </div>

        {!isManualEntry ? (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <GearSpecParser 
              onSpecsParsed={(specs) => {
                setFormData(prev => ({ ...prev, ...specs }));
                // Show success message and switch to manual entry for review
                setIsManualEntry(true);
                // Scroll to top of form
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Add success message if coming from spec parser */}
            {formData.make && formData.model && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-green-800">
                  ✓ Successfully parsed specifications for {formData.make} {formData.model}. 
                  Please review the details below and make any necessary adjustments before adding to your collection.
                </p>
              </div>
            )}
            {/* General Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
              <h2 className="text-xl font-medium text-gray-900">General Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                    required
                  >
                    {Object.values(GearType).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                  <input
                    type="text"
                    name="make"
                    value={formData.make}
                    onChange={handleInputChange}
                    placeholder="e.g., Gretsch, Fender, Breedlove"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="e.g., G6120T-SW"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="e.g., 2023"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model Number</label>
                  <input
                    type="text"
                    name="modelNumber"
                    value={formData.modelNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., 2507000576"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Series</label>
                  <input
                    type="text"
                    name="series"
                    value={formData.series}
                    onChange={handleInputChange}
                    placeholder="e.g., Professional II"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                  <input
                    type="text"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., 13098358"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Orientation</label>
                  <select
                    name="orientation"
                    value={formData.orientation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                  >
                    <option value="">Select orientation...</option>
                    <option value="Right Handed">Right Handed</option>
                    <option value="Left Handed">Left Handed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Strings</label>
                  <select
                    name="numberOfStrings"
                    value={formData.numberOfStrings}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                  >
                    <option value="">Select number of strings...</option>
                    <option value="6">6</option>
                    <option value="12">12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="e.g., 5 lbs 15 oz"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                <div className="space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="w-full"
                  />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square">
                        <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Body Specs */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
              <h2 className="text-xl font-medium text-gray-900">Body Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(formData.specs.body).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleSpecsChange('body', key, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Neck Specs */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
              <h2 className="text-xl font-medium text-gray-900">Neck Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(formData.specs.neck).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleSpecsChange('neck', key, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Headstock Specs */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
              <h2 className="text-xl font-medium text-gray-900">Headstock Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(formData.specs.headstock).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleSpecsChange('headstock', key, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Hardware Specs */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
              <h2 className="text-xl font-medium text-gray-900">Hardware Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(formData.specs.hardware).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleSpecsChange('hardware', key, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Electronics Specs */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
              <h2 className="text-xl font-medium text-gray-900">Electronics Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(formData.specs.electronics).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleSpecsChange('electronics', key, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Extras */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
              <h2 className="text-xl font-medium text-gray-900">Additional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(formData.specs.extras).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleSpecsChange('extras', key, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 rounded text-white transition-colors ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#EE5430] hover:bg-[#EE5430]/90'
                }`}
              >
                {loading ? 'Adding...' : 'Add Gear'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}; 
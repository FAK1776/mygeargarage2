import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
import { GearService } from '../services/gearService';
import { GearType, GuitarSpecs, GearFormData } from '../types/gear';

const gearService = new GearService();

const INITIAL_FORM_DATA: GearFormData = {
  make: '',
  modelName: '',
  modelNumber: '',
  series: '',
  serialNumber: '',
  orientation: '',
  numberOfStrings: '',
  weight: '',
  images: {
    urls: [],
    uploadedFiles: []
  },
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

  const handleImageUrlAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const input = e.currentTarget;
      const url = input.value.trim();
      if (url) {
        setFormData(prev => ({
          ...prev,
          images: {
            ...prev.images,
            urls: [...prev.images.urls, url]
          }
        }));
        input.value = '';
      }
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
          await gearService.uploadImage(user.uid, newGear.id, imageFiles[i]);
        }
      }

      navigate('/');
    } catch (error) {
      console.error('Error adding gear:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-light text-gray-900 mb-8">Add New Guitar</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
            <h2 className="text-xl font-medium text-gray-900">General Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Model Name</label>
                <input
                  type="text"
                  name="modelName"
                  value={formData.modelName}
                  onChange={handleInputChange}
                  placeholder="e.g., G2622T Streamliner™"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model Number</label>
                <input
                  type="text"
                  name="modelNumber"
                  value={formData.modelNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., 2807250505"
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
                  placeholder="e.g., Streamliner™ Collection"
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
                <input
                  type="text"
                  placeholder="Or paste image URL and press Enter"
                  onKeyDown={handleImageUrlAdd}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square">
                      <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                    </div>
                  ))}
                  {formData.images.urls.map((url, index) => (
                    <div key={`url-${index}`} className="relative aspect-square">
                      <img src={url} alt={`URL ${index + 1}`} className="w-full h-full object-cover rounded-md" />
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body Shape</label>
                <input
                  type="text"
                  value={formData.specs.body.shape}
                  onChange={(e) => handleSpecsChange('body', 'shape', e.target.value)}
                  placeholder="e.g., Dreadnought, Center Block"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body Type</label>
                <input
                  type="text"
                  value={formData.specs.body.type}
                  onChange={(e) => handleSpecsChange('body', 'type', e.target.value)}
                  placeholder="e.g., Solidbody, Hollowbody"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body Material</label>
                <input
                  type="text"
                  value={formData.specs.body.material}
                  onChange={(e) => handleSpecsChange('body', 'material', e.target.value)}
                  placeholder="e.g., Laminated Maple, Mahogany"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body Top/Back</label>
                <input
                  type="text"
                  value={formData.specs.body.topBack}
                  onChange={(e) => handleSpecsChange('body', 'topBack', e.target.value)}
                  placeholder="e.g., Arched Laminated Maple"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body Finish</label>
                <input
                  type="text"
                  value={formData.specs.body.finish}
                  onChange={(e) => handleSpecsChange('body', 'finish', e.target.value)}
                  placeholder="e.g., Gloss, Vintage Semi-Gloss"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body Depth</label>
                <input
                  type="text"
                  value={formData.specs.body.depth}
                  onChange={(e) => handleSpecsChange('body', 'depth', e.target.value)}
                  placeholder='e.g., Standard, 1.75"'
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body Binding</label>
                <input
                  type="text"
                  value={formData.specs.body.binding}
                  onChange={(e) => handleSpecsChange('body', 'binding', e.target.value)}
                  placeholder="e.g., Antique White with B/W/B Purfling"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bracing</label>
                <input
                  type="text"
                  value={formData.specs.body.bracing}
                  onChange={(e) => handleSpecsChange('body', 'bracing', e.target.value)}
                  placeholder="e.g., Center Block, Scalloped X-Brace"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cutaway</label>
                <input
                  type="text"
                  value={formData.specs.body.cutaway}
                  onChange={(e) => handleSpecsChange('body', 'cutaway', e.target.value)}
                  placeholder="e.g., Double Cutaway, Venetian"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Top Color</label>
                <input
                  type="text"
                  value={formData.specs.body.topColor}
                  onChange={(e) => handleSpecsChange('body', 'topColor', e.target.value)}
                  placeholder="e.g., 2-Color Sunburst, Vintage White"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
                />
              </div>
            </div>
          </div>

          {/* Neck Specs */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
            <h2 className="text-xl font-medium text-gray-900">Neck Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Add all neck specification fields here */}
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

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#EE5430] hover:bg-[#EE5430]/90 text-white font-medium rounded-md disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Guitar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 
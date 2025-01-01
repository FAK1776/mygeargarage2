import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaseGear, GearType, GearStatus } from '../types/gear';
import { GearService } from '../services/gearService';
import { useAuth } from '../hooks/useAuth';
import { createEmptyGuitarSpecs } from '../utils/gearUtils';
import { GuitarSpecsForm } from '../components/gear/details/specs/GuitarSpecsForm';
import { GearSpecParser } from '../components/gear/GearSpecParser';
import { PageLayout } from '../components/layout/PageLayout';

export const AddGear = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const gearService = new GearService();

  const [formData, setFormData] = useState<Partial<BaseGear>>({
    type: GearType.Guitar,
    status: GearStatus.Own,
    specs: createEmptyGuitarSpecs(),
    images: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await gearService.addGear(user.uid, formData as BaseGear);
      navigate('/my-gear');
    } catch (error) {
      console.error('Error adding gear:', error);
    }
  };

  const handleSpecsParsed = (parsedGear: Partial<BaseGear>) => {
    setFormData(prev => ({
      ...prev,
      ...parsedGear,
      specs: {
        ...prev.specs,
        ...parsedGear.specs
      }
    }));
  };

  return (
    <PageLayout title="Add Gear">
      <div className="space-y-8">
        {/* Parser Section */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-6">
            Paste specifications from a manufacturer's website to automatically fill out the form below. 
            You can also manually enter or edit the details after parsing.
          </p>
          <GearSpecParser onSpecsParsed={handleSpecsParsed} />
        </div>

        {/* Main Form */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Type and Status Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as GearType })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430] focus:border-transparent"
                >
                  {Object.values(GearType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as GearStatus })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430] focus:border-transparent"
                >
                  {Object.values(GearStatus).map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Specifications Form */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Gear Details</h2>
              <GuitarSpecsForm
                specs={formData.specs}
                isEditing={true}
                onUpdate={(specs) => setFormData({ ...formData, specs })}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-[#EE5430] text-white font-medium rounded-md hover:bg-[#EE5430]/90 transition-colors"
              >
                Add to My Gear
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
}; 
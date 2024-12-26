import React, { useState } from 'react';
import { BaseGear, GearStatus } from '../../types/gear';
import { geminiService } from '../../services/geminiService';
import { GearService } from '../../services/gearService';
import { useAuth } from '../../hooks/useAuth';

interface GearSpecParserProps {
  onGearCreated?: (gear: BaseGear) => void;
  onSwitchToManual?: () => void;
}

export const GearSpecParser: React.FC<GearSpecParserProps> = ({ onGearCreated, onSwitchToManual }) => {
  const { user } = useAuth();
  const [specs, setSpecs] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const gearService = new GearService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!specs.trim() || !user) return;

    setLoading(true);
    setError(null);

    try {
      // Parse the specifications using Gemini
      const parsedData = await geminiService.parseGearSpecs(specs);
      
      // Create the gear with the parsed data
      const gearData: Omit<BaseGear, 'id' | 'createdAt' | 'updatedAt'> = {
        ...parsedData,
        userId: user.uid,
        images: [],
        status: GearStatus.Own
      } as Omit<BaseGear, 'id' | 'createdAt' | 'updatedAt'>;

      // Add the gear to the database
      const gearId = await gearService.addGear(user.uid, gearData);
      
      // Get the complete gear object
      const newGear = await gearService.getGearById(gearId);
      
      if (onGearCreated && newGear) {
        onGearCreated(newGear);
      }

      setSpecs('');
    } catch (err) {
      console.error('Error processing gear specs:', err);
      setError(err instanceof Error ? err.message : 'Failed to process gear specifications');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-gray-900">Add Gear from Specifications</h2>
        <button
          onClick={onSwitchToManual}
          className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
        >
          Switch to Manual Entry
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paste Manufacturer Specifications
            </label>
            <textarea
              value={specs}
              onChange={(e) => setSpecs(e.target.value)}
              placeholder="Paste the gear specifications here..."
              className="w-full h-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !specs.trim()}
              className={`px-4 py-2 rounded text-white transition-colors ${
                loading || !specs.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#EE5430] hover:bg-[#EE5430]/90'
              }`}
            >
              {loading ? 'Processing...' : 'Create Gear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 
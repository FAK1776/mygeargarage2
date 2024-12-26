import React, { useState } from 'react';
import { BaseGear, GearStatus } from '../../types/gear';
import { geminiService } from '../../services/geminiService';
import { GearService } from '../../services/gearService';
import { useAuth } from '../../hooks/useAuth';

interface GearSpecParserProps {
  onSpecsParsed: (specs: Partial<BaseGear>) => void;
}

export const GearSpecParser: React.FC<GearSpecParserProps> = ({ onSpecsParsed }) => {
  const [specs, setSpecs] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<Partial<BaseGear> | null>(null);

  const handleParse = async () => {
    if (!specs.trim()) return;

    setLoading(true);
    setError(null);
    setParsedData(null);

    try {
      console.log('Attempting to parse specs:', specs);
      // Parse the specifications using Gemini
      const result = await geminiService.parseGearSpecs(specs);
      console.log('Successfully parsed specs:', result);
      setParsedData(result);
    } catch (err) {
      console.error('Error processing gear specs:', err);
      if (err instanceof Error) {
        console.error('Error details:', {
          message: err.message,
          stack: err.stack
        });
      }
      setError(err instanceof Error ? err.message : 'Failed to process gear specifications');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parsedData) return;
    onSpecsParsed(parsedData);
    setSpecs('');
    setParsedData(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Paste Manufacturer's Specifications
        </label>
        <textarea
          value={specs}
          onChange={(e) => {
            setSpecs(e.target.value);
            // Clear previous results when input changes
            setParsedData(null);
            setError(null);
          }}
          placeholder="Paste the manufacturer's specifications here..."
          className="w-full h-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430]"
          disabled={loading}
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {parsedData && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 space-y-2">
          <p className="text-green-800 font-medium">✓ Successfully parsed specifications:</p>
          <ul className="text-sm text-green-700 space-y-1">
            <li>Make: {parsedData.make}</li>
            <li>Model: {parsedData.model}</li>
            <li>Type: {parsedData.type}</li>
            {parsedData.year && <li>Year: {parsedData.year}</li>}
            {parsedData.modelNumber && <li>Model Number: {parsedData.modelNumber}</li>}
          </ul>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleParse}
          disabled={loading || !specs.trim()}
          className={`px-4 py-2 rounded text-white transition-colors ${
            loading || !specs.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#EE5430] hover:bg-[#EE5430]/90'
          }`}
        >
          {loading ? 'Processing...' : 'Parse Specifications'}
        </button>

        {parsedData && (
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md"
          >
            Continue with These Specifications
          </button>
        )}
      </div>
    </form>
  );
}; 
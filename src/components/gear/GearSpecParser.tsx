import React, { useState } from 'react';
import { BaseGear } from '../../types/gear';
import { GearParsingService } from '../../services/gearParsingService';

interface GearSpecParserProps {
  onSpecsParsed: (parsedGear: Partial<BaseGear>) => void;
}

export const GearSpecParser: React.FC<GearSpecParserProps> = ({ onSpecsParsed }) => {
  const [specs, setSpecs] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<Partial<BaseGear> | null>(null);
  const parsingService = new GearParsingService();

  const handleParse = async () => {
    if (!specs.trim()) {
      setError('Please enter specifications to parse');
      return;
    }

    setLoading(true);
    setError(null);
    setParsedData(null);

    try {
      const result = await parsingService.parseGearSpecifications(specs);
      setParsedData(result);
      onSpecsParsed(result);
    } catch (err) {
      console.error('Error in handleParse:', err);
      setError(err instanceof Error ? err.message : 'Failed to parse specifications. Please check the format and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={specs}
        onChange={(e) => {
          setSpecs(e.target.value);
          setParsedData(null);
          setError(null);
        }}
        placeholder="Paste the manufacturer's specifications here..."
        className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430] focus:border-transparent resize-y"
        disabled={loading}
      />

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {parsedData && (
        <div className="text-sm bg-green-50 p-3 rounded-md border border-green-200">
          <p className="font-medium text-green-800 mb-2">✓ Successfully parsed specifications</p>
          <div className="text-green-700 grid grid-cols-2 gap-2">
            <div>Make: {parsedData.make}</div>
            <div>Model: {parsedData.model}</div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleParse}
          disabled={loading || !specs.trim()}
          className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
            loading || !specs.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#EE5430] hover:bg-[#EE5430]/90'
          }`}
        >
          {loading ? 'Processing...' : 'Parse Specifications'}
        </button>
      </div>
    </div>
  );
}; 
import React, { useState } from 'react';
import { BaseGear, HistoryRecord } from '../../../types/gear';
import { geminiService } from '../../../services/geminiService';

interface GearHistoryChatProps {
  gear: BaseGear;
  onUpdate: (updates: Partial<BaseGear>, shouldSave: boolean) => void;
}

interface ParsedHistoryRecord {
  date: Date;
  description: string;
  provider?: string;
  cost?: number;
  tags: string[];
  notes?: string;
}

export const GearHistoryChat: React.FC<GearHistoryChatProps> = ({ gear, onUpdate }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);

    try {
      console.log('Submitting new service history record:', input);
      const parsedRecord = await geminiService.parseGearHistory(input, gear) as ParsedHistoryRecord;
      console.log('Parsed service history record:', parsedRecord);
      
      if (!parsedRecord || !parsedRecord.date || !parsedRecord.description) {
        throw new Error('Failed to parse history record properly');
      }

      // Convert the date if it's not already an ISO string
      const dateToSubmit = typeof parsedRecord.date === 'string' 
        ? parsedRecord.date 
        : parsedRecord.date.toISOString();

      // Create a new unified record with the parsed data
      const newRecord: HistoryRecord = {
        id: `srv-${Date.now()}`,
        date: dateToSubmit,
        description: parsedRecord.description,
        provider: parsedRecord.provider || '',
        cost: parsedRecord.cost || 0,
        notes: parsedRecord.notes || '',
        tags: parsedRecord.tags || ['service'] // Default to service tag if none provided
      };
      console.log('Created new history record:', newRecord);

      // Ensure we have a valid array of history records
      const currentHistory = Array.isArray(gear.serviceHistory) ? gear.serviceHistory : [];
      console.log('Current service history:', currentHistory);
      
      // Update the history with the new record
      const updatedHistory = [newRecord, ...currentHistory];
      console.log('Updated service history:', updatedHistory);
      
      // Pass shouldSave=true to ensure the update is persisted to Firestore
      onUpdate({ ...gear, serviceHistory: updatedHistory }, true);
      setInput('');
    } catch (err) {
      console.error('Error processing history:', err);
      setError(err instanceof Error ? err.message : 'Failed to process input');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tell me about any service, maintenance, or modifications... (e.g., 'Today I had the guitar set up at Guitar Center, they adjusted the truss rod and installed a new bone nut for $150')"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430]/20 focus:border-[#EE5430] min-h-[100px]"
          disabled={loading}
        />
        
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-[#EE5430] text-white rounded-md hover:bg-[#EE5430]/90 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Add Record'}
        </button>
      </form>
    </div>
  );
}; 
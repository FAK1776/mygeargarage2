import React, { useState, useMemo, useEffect } from 'react';
import { BaseGear, HistoryRecord } from '../../../types/gear';
import { GearHistoryChat } from './GearHistoryChat';
import { FaEdit, FaTrash, FaSave, FaTimes, FaFilter } from 'react-icons/fa';

interface GearHistoryProps {
  gear: BaseGear;
  onUpdate: (updates: Partial<BaseGear>, shouldSave?: boolean) => void;
  isEditing: boolean;
}

type HistoryTag = 'ownership' | 'modification' | 'maintenance' | 'repairs';

const TAG_COLORS: Record<HistoryTag, { bg: string; text: string }> = {
  ownership: { bg: 'bg-purple-100', text: 'text-purple-800' },
  modification: { bg: 'bg-blue-100', text: 'text-blue-800' },
  maintenance: { bg: 'bg-green-100', text: 'text-green-800' },
  repairs: { bg: 'bg-red-100', text: 'text-red-800' },
};

export const GearHistory: React.FC<GearHistoryProps> = ({ gear, onUpdate, isEditing }) => {
  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<Partial<HistoryRecord>>({});
  const [selectedTags, setSelectedTags] = useState<HistoryTag[]>([]);

  useEffect(() => {
    console.log('GearHistory component mounted/updated:', {
      gearId: gear.id,
      serviceHistory: gear.serviceHistory
    });
  }, [gear]);

  const handleEditStart = (record: HistoryRecord) => {
    console.log('Starting edit of record:', record);
    setEditingRecord(record.id);
    setEditedValues(record);
  };

  const handleEditCancel = () => {
    console.log('Canceling record edit');
    setEditingRecord(null);
    setEditedValues({});
  };

  const handleEditSave = (recordId: string) => {
    console.log('Saving edited record:', { recordId, editedValues });
    if (!gear.serviceHistory) return;

    const updatedHistory = gear.serviceHistory.map(record => 
      record.id === recordId ? { ...record, ...editedValues } : record
    );

    console.log('Updated service history:', updatedHistory);
    onUpdate({ ...gear, serviceHistory: updatedHistory }, true);
    setEditingRecord(null);
    setEditedValues({});
  };

  const handleDelete = (recordId: string) => {
    console.log('Deleting record:', recordId);
    if (!gear.serviceHistory) return;

    const updatedHistory = gear.serviceHistory.filter(record => record.id !== recordId);
    console.log('Service history after deletion:', updatedHistory);
    onUpdate({ ...gear, serviceHistory: updatedHistory }, true);
  };

  const handleFieldChange = (field: keyof HistoryRecord, value: string | number | string[]) => {
    console.log('Field change:', { field, value });
    setEditedValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagToggle = (tag: HistoryTag) => {
    console.log('Toggling tag:', tag);
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const sortedAndFilteredHistory = useMemo(() => {
    if (!gear.serviceHistory) return [];

    let filtered = gear.serviceHistory;
    console.log('Processing service history:', {
      total: filtered.length,
      selectedTags
    });
    
    // Apply tag filtering
    if (selectedTags.length > 0) {
      filtered = filtered.filter(record => 
        record.tags?.some(tag => selectedTags.includes(tag as HistoryTag))
      );
      console.log('Filtered by tags:', {
        selectedTags,
        remainingRecords: filtered.length
      });
    }

    // Sort by date descending
    const sorted = [...filtered].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    console.log('Sorted service history:', sorted);
    return sorted;
  }, [gear.serviceHistory, selectedTags]);

  return (
    <div className="space-y-6">
      {/* Add New Record */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Record</h3>
        <GearHistoryChat gear={gear} onUpdate={onUpdate} />
      </div>

      {/* Tag Filters */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(TAG_COLORS).map(([tag, colors]) => (
          <button
            key={tag}
            onClick={() => handleTagToggle(tag as HistoryTag)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
              ${selectedTags.includes(tag as HistoryTag)
                ? `${colors.bg} ${colors.text}`
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </button>
        ))}
      </div>

      {/* Service History Records */}
      <div className="space-y-4">
        {sortedAndFilteredHistory.map(record => (
          <div key={record.id} className="bg-white rounded-lg border p-4 space-y-2">
            {editingRecord === record.id ? (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      value={new Date(editedValues.date || record.date).toISOString().split('T')[0]}
                      onChange={e => handleFieldChange('date', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#EE5430] focus:ring-[#EE5430] sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={editedValues.description || record.description}
                      onChange={e => handleFieldChange('description', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#EE5430] focus:ring-[#EE5430] sm:text-sm"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Provider</label>
                    <input
                      type="text"
                      value={editedValues.provider || record.provider}
                      onChange={e => handleFieldChange('provider', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#EE5430] focus:ring-[#EE5430] sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cost</label>
                    <input
                      type="number"
                      value={editedValues.cost || record.cost}
                      onChange={e => handleFieldChange('cost', parseFloat(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#EE5430] focus:ring-[#EE5430] sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tags</label>
                    <div className="mt-2 flex gap-2">
                      {Object.entries(TAG_COLORS).map(([tag, colors]) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            const currentTags = editedValues.tags || record.tags || [];
                            const newTags = currentTags.includes(tag)
                              ? currentTags.filter(t => t !== tag)
                              : [...currentTags, tag];
                            handleFieldChange('tags', newTags);
                          }}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                            ${(editedValues.tags || record.tags || []).includes(tag)
                              ? `${colors.bg} ${colors.text}`
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                          {tag.charAt(0).toUpperCase() + tag.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                      value={editedValues.notes || record.notes}
                      onChange={e => handleFieldChange('notes', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#EE5430] focus:ring-[#EE5430] sm:text-sm"
                      rows={2}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleEditSave(record.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-[#EE5430] hover:bg-[#EE5430]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EE5430]"
                  >
                    <FaSave className="mr-1.5" size={12} />
                    Save
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EE5430]"
                  >
                    <FaTimes className="mr-1.5" size={12} />
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">
                      {new Date(record.date).toLocaleDateString()}
                    </p>
                    <p className="mt-1 text-sm text-gray-900">{record.description}</p>
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditStart(record)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {record.tags?.map(tag => (
                    <span
                      key={tag}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium
                        ${TAG_COLORS[tag as HistoryTag]?.bg || 'bg-gray-100'}
                        ${TAG_COLORS[tag as HistoryTag]?.text || 'text-gray-800'}`}
                    >
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </span>
                  ))}
                </div>
                {record.provider && (
                  <p className="text-sm text-gray-600">Provider: {record.provider}</p>
                )}
                {record.cost > 0 && (
                  <p className="text-sm text-gray-600">Cost: ${record.cost.toFixed(2)}</p>
                )}
                {record.notes && (
                  <p className="text-sm text-gray-500 mt-2">{record.notes}</p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 
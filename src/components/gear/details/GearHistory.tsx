import React, { useState } from 'react';
import { BaseGear } from '../../../types/gear';
import { FormField } from '../../common/FormField';
import { GearHistoryChat } from './GearHistoryChat';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

interface HistoryRecord {
  id: string;
  date: Date;
  description: string;
  provider?: string;
  cost?: number;
  tags: string[];
  notes?: string;
  attachments?: string[];
}

interface GearHistoryProps {
  gear: BaseGear;
  isEditing: boolean;
  onUpdate: (updates: Partial<BaseGear>) => void;
}

export const GearHistory: React.FC<GearHistoryProps> = ({ gear, isEditing, onUpdate }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [editedRecord, setEditedRecord] = useState<HistoryRecord | null>(null);

  const allRecords: HistoryRecord[] = [
    ...(gear.serviceHistory || []).map(record => ({
      ...record,
      tags: record.tags || [record.type]
    }))
  ].sort((a, b) => {
    // Convert both dates to timestamps for reliable comparison
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    // Sort in descending order (newest first)
    return dateB - dateA;
  });

  const availableTags = ['service', 'modification', 'ownership'];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredRecords = selectedTags.length > 0
    ? allRecords.filter(record => 
        selectedTags.some(tag => record.tags.includes(tag))
      )
    : allRecords;

  const formatDate = (date: Date) => {
    if (!date) return 'Invalid Date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEdit = (record: HistoryRecord) => {
    setEditingRecord(record.id);
    setEditedRecord({ ...record });
  };

  const handleSaveEdit = () => {
    if (!editedRecord) return;

    // Ensure the date is properly formatted
    const formattedRecord = {
      ...editedRecord,
      date: editedRecord.date ? new Date(editedRecord.date.getTime()) : new Date(),
      type: editedRecord.tags.join(', ')
    };

    const updatedHistory = gear.serviceHistory?.map(record =>
      record.id === editedRecord.id ? formattedRecord : record
    ) || [];

    onUpdate({ serviceHistory: updatedHistory });
    setEditingRecord(null);
    setEditedRecord(null);
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
    setEditedRecord(null);
  };

  const handleDelete = (recordId: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      const updatedHistory = gear.serviceHistory?.filter(record => record.id !== recordId) || [];
      onUpdate({ serviceHistory: updatedHistory });
    }
  };

  return (
    <div className="space-y-6">
      {/* Chat Interface */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Add History Record</h3>
        <p className="text-sm text-gray-600 mb-4">
          Just tell me what happened to your gear, and I'll help you record it.
        </p>
        <GearHistoryChat gear={gear} onUpdate={onUpdate} />
      </div>

      {/* Tag Filters */}
      <div className="flex flex-wrap gap-2">
        {availableTags.map(tag => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedTags.includes(tag)
                ? 'bg-[#EE5430] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <div key={record.id} className="bg-gray-50 p-4 rounded-lg">
            {editingRecord === record.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    {availableTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          if (!editedRecord) return;
                          const newTags = editedRecord.tags.includes(tag)
                            ? editedRecord.tags.filter(t => t !== tag)
                            : [...editedRecord.tags, tag];
                          setEditedRecord({ ...editedRecord, tags: newTags });
                        }}
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          editedRecord?.tags.includes(tag)
                            ? 'bg-[#EE5430] text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="text-green-600 hover:text-green-700"
                    >
                      <FaSave />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-600 hover:text-gray-700"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
                <FormField
                  label="Date"
                  value={editedRecord?.date}
                  type="date"
                  isEditing={true}
                  onChange={(value) => {
                    if (!editedRecord) return;
                    // Create date at noon to avoid timezone issues
                    const [year, month, day] = value.split('-').map(Number);
                    const newDate = new Date(year, month - 1, day, 12);
                    setEditedRecord({
                      ...editedRecord,
                      date: newDate
                    });
                  }}
                />
                <FormField
                  label="Provider"
                  value={editedRecord?.provider}
                  isEditing={true}
                  onChange={(value) => {
                    if (!editedRecord) return;
                    setEditedRecord({
                      ...editedRecord,
                      provider: value
                    });
                  }}
                />
                <FormField
                  label="Cost"
                  value={editedRecord?.cost}
                  type="number"
                  isEditing={true}
                  onChange={(value) => {
                    if (!editedRecord) return;
                    setEditedRecord({
                      ...editedRecord,
                      cost: Number(value)
                    });
                  }}
                />
                <FormField
                  label="Description"
                  value={editedRecord?.description}
                  type="textarea"
                  isEditing={true}
                  onChange={(value) => {
                    if (!editedRecord) return;
                    setEditedRecord({
                      ...editedRecord,
                      description: value
                    });
                  }}
                />
                <FormField
                  label="Notes"
                  value={editedRecord?.notes}
                  type="textarea"
                  isEditing={true}
                  onChange={(value) => {
                    if (!editedRecord) return;
                    setEditedRecord({
                      ...editedRecord,
                      notes: value
                    });
                  }}
                />
              </div>
            ) : (
              // View Mode
              <>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-wrap gap-2">
                    {record.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(record)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="grid gap-4">
                  <div className="flex justify-between items-start">
                    <div className="text-sm text-gray-500">{formatDate(record.date)}</div>
                    {record.cost && (
                      <div className="text-sm font-medium">${record.cost.toFixed(2)}</div>
                    )}
                  </div>
                  {record.provider && (
                    <div className="text-sm text-gray-700">
                      <span className="font-medium">Provider:</span> {record.provider}
                    </div>
                  )}
                  <div className="text-gray-900">{record.description}</div>
                  {record.notes && (
                    <div className="text-sm text-gray-600">{record.notes}</div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 
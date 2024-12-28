import React, { useState } from 'react';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { GearHistoryChat } from './GearHistoryChat';
import { FormField } from '../../common/FormField';
import { HistoryRecord } from '../../../types/gear';

interface GearHistoryProps {
  gear: any;
  isEditing?: boolean;
  onUpdate: (updates: any) => void;
}

export const GearHistory: React.FC<GearHistoryProps> = ({ gear, isEditing, onUpdate }) => {
  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [editedRecord, setEditedRecord] = useState<HistoryRecord | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const availableTags = ['maintenance', 'service', 'ownership'];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleEdit = (record: HistoryRecord) => {
    setEditingRecord(record.id);
    setEditedRecord({ ...record });
  };

  const handleSaveEdit = () => {
    if (!editedRecord) return;

    const formattedRecord = {
      ...editedRecord,
      date: editedRecord.date ? new Date(editedRecord.date).toISOString() : new Date().toISOString(),
    };

    const updatedHistory = gear.serviceHistory?.map((record: HistoryRecord) =>
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
      const updatedHistory = gear.serviceHistory?.filter((record: HistoryRecord) => record.id !== recordId) || [];
      onUpdate({ serviceHistory: updatedHistory });
    }
  };

  const sortedHistory = [...(gear.serviceHistory || [])]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredHistory = selectedTags.length > 0
    ? sortedHistory.filter(record => 
        selectedTags.some(tag => record.tags?.includes(tag))
      )
    : sortedHistory;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getTagStyle = (tag: string) => {
    switch (tag) {
      case 'service':
        return {
          active: 'bg-blue-600 text-white',
          inactive: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
        };
      case 'maintenance':
        return {
          active: 'bg-purple-600 text-white',
          inactive: 'bg-purple-100 text-purple-800 hover:bg-purple-200'
        };
      case 'ownership':
        return {
          active: 'bg-green-600 text-white',
          inactive: 'bg-green-100 text-green-800 hover:bg-green-200'
        };
      default:
        return {
          active: 'bg-[#EE5430] text-white',
          inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4">
        <GearHistoryChat gear={gear} onUpdate={onUpdate} />
      </div>

      <div className="flex flex-wrap gap-2">
        {availableTags.map(tag => {
          const style = getTagStyle(tag);
          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTags.includes(tag)
                  ? style.active
                  : style.inactive
              }`}
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </button>
          );
        })}
      </div>
      
      {filteredHistory.length > 0 && (
        <div className="space-y-2">
          {filteredHistory.map((record: HistoryRecord) => (
            <div
              key={record.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:border-[#EE5430]/20 transition-colors"
            >
              {editingRecord === record.id ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-900">Edit Record</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="text-green-600 hover:text-green-700 transition-colors"
                        title="Save changes"
                      >
                        <FaSave size={16} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Cancel editing"
                      >
                        <FaTimes size={16} />
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
                      setEditedRecord({
                        ...editedRecord,
                        date: value
                      });
                    }}
                  />
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          if (!editedRecord) return;
                          const newTags = editedRecord.tags?.includes(tag)
                            ? editedRecord.tags.filter(t => t !== tag)
                            : [...(editedRecord.tags || []), tag];
                          setEditedRecord({
                            ...editedRecord,
                            tags: newTags
                          });
                        }}
                        className={`px-2 py-0.5 rounded-full text-xs transition-colors ${
                          editedRecord?.tags?.includes(tag)
                            ? 'bg-[#EE5430] text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </button>
                    ))}
                  </div>
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
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {record.date ? new Date(record.date).toLocaleDateString() : 'Date not specified'}
                      </span>
                      <div className="flex gap-1">
                        {record.tags?.map(tag => (
                          <span
                            key={tag}
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              tag === 'service'
                                ? 'bg-blue-100 text-blue-800'
                                : tag === 'maintenance'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {tag.charAt(0).toUpperCase() + tag.slice(1)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{record.description}</p>
                    {record.provider && (
                      <p className="text-sm text-gray-500 mt-1">
                        Provider: {record.provider}
                      </p>
                    )}
                    {record.cost > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Cost: {formatPrice(record.cost)}
                      </p>
                    )}
                    {record.notes && (
                      <p className="text-sm text-gray-500 mt-1 italic">
                        {record.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(record)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Edit record"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete record"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 
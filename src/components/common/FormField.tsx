import React from 'react';
import { GearType } from '../../types/gear';

interface Option {
  value: string;
  label: string;
}

interface FormFieldProps {
  label: string;
  value: any;
  field?: string;
  isEditing?: boolean;
  type?: 'text' | 'select' | 'date' | 'number' | 'textarea';
  options?: (string | Option)[];
  onChange?: (value: any) => void;
  placeholder?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  value, 
  field, 
  isEditing = false, 
  type = 'text',
  options = [],
  onChange,
  placeholder
}) => {
  if (!isEditing && (!value || value === 'N/A')) return null;

  if (isEditing && onChange) {
    if (type === 'select') {
      return (
        <div className="flex justify-between py-1 border-b border-gray-100">
          <label className="text-gray-600 min-w-[120px]">{label}:</label>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="text-right flex-1 ml-4 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {options.map((option) => {
              if (typeof option === 'string') {
                return (
                  <option key={option} value={option}>
                    {option}
                  </option>
                );
              } else {
                return (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                );
              }
            })}
          </select>
        </div>
      );
    }

    if (type === 'date') {
      const dateValue = value ? new Date(value).toISOString().split('T')[0] : '';
      return (
        <div className="flex justify-between py-1 border-b border-gray-100">
          <label className="text-gray-600 min-w-[120px]">{label}:</label>
          <input
            type="date"
            value={dateValue}
            onChange={(e) => {
              const newDate = e.target.value ? new Date(e.target.value) : undefined;
              onChange(newDate);
            }}
            className="text-right flex-1 ml-4 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      );
    }

    if (type === 'number') {
      return (
        <div className="flex justify-between py-1 border-b border-gray-100">
          <label className="text-gray-600 min-w-[120px]">{label}:</label>
          <input
            type="number"
            step="0.01"
            value={value || ''}
            onChange={(e) => onChange(parseFloat(e.target.value) || undefined)}
            className="text-right flex-1 ml-4 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      );
    }

    if (type === 'textarea') {
      return (
        <div className="flex justify-between py-1 border-b border-gray-100">
          <label className="text-gray-600 min-w-[120px]">{label}:</label>
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="text-right flex-1 ml-4 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder={placeholder}
          />
        </div>
      );
    }

    return (
      <div className="flex justify-between py-1 border-b border-gray-100">
        <label className="text-gray-600 min-w-[120px]">{label}:</label>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="text-right flex-1 ml-4 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
        />
      </div>
    );
  }

  return (
    <div className="flex justify-between py-1 border-b border-gray-100">
      <span className="text-gray-600 min-w-[120px]">{label}:</span>
      <span className="text-gray-900 font-medium text-right flex-1 ml-4">
        {type === 'date' ? new Date(value).toLocaleDateString() : value}
      </span>
    </div>
  );
}; 
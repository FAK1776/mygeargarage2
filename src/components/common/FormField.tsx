import React, { useState, useEffect } from 'react';
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
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  value, 
  field, 
  isEditing = false, 
  type = 'text',
  options = [],
  onChange,
  placeholder,
  required
}) => {
  const [localValue, setLocalValue] = useState(value);

  // Keep local value in sync with prop value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  if (!isEditing && (!value || value === 'N/A')) return null;

  if (isEditing && onChange) {
    if (type === 'text') {
      return (
        <div className="flex justify-between py-1 border-b border-gray-100">
          <label className="text-gray-600 min-w-[120px]">{label}:</label>
          <input
            type="text"
            value={localValue || ''}
            onChange={(e) => {
              const newValue = e.target.value;
              setLocalValue(newValue);
              onChange(newValue);
            }}
            className="text-right flex-1 ml-4 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={placeholder}
          />
        </div>
      );
    }

    if (type === 'select') {
      return (
        <div className="flex justify-between py-1 border-b border-gray-100">
          <label className="text-gray-600 min-w-[120px]">{label}:</label>
          <select
            value={localValue || ''}
            onChange={(e) => {
              const newValue = e.target.value;
              setLocalValue(newValue);
              onChange(newValue);
            }}
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
      let dateValue = '';
      if (value) {
        try {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            dateValue = date.toISOString().split('T')[0];
          }
        } catch (e) {
          console.error('Invalid date value:', value);
        }
      }
      
      return (
        <div className="flex justify-between py-1 border-b border-gray-100">
          <label className="text-gray-600 min-w-[120px]">{label}:</label>
          <input
            type="date"
            value={dateValue}
            onChange={(e) => {
              if (e.target.value) {
                const [year, month, day] = e.target.value.split('-').map(Number);
                const newDate = new Date(year, month - 1, day, 12);
                setLocalValue(newDate);
                onChange(newDate);
              } else {
                setLocalValue(undefined);
                onChange(undefined);
              }
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
            value={localValue || ''}
            onChange={(e) => {
              const newValue = parseFloat(e.target.value) || undefined;
              setLocalValue(newValue);
              onChange(newValue);
            }}
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
            value={localValue || ''}
            onChange={(e) => {
              const newValue = e.target.value;
              setLocalValue(newValue);
              onChange(newValue);
            }}
            className="text-right flex-1 ml-4 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder={placeholder}
          />
        </div>
      );
    }
  }

  return (
    <div className="flex justify-between py-1 border-b border-gray-100">
      <label className="text-gray-600 min-w-[120px]">{label}:</label>
      <span className="text-right flex-1 ml-4">{localValue || ''}</span>
    </div>
  );
}; 
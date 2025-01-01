import React from 'react';
import { BaseGear } from '../../../types/gear';
import { FaTimes, FaEdit, FaSave } from 'react-icons/fa';

interface GearDetailsHeaderProps {
  gear: BaseGear;
  isEditMode: boolean;
  onSave: () => void;
  onEdit: () => void;
  onClose: () => void;
}

export const GearDetailsHeader: React.FC<GearDetailsHeaderProps> = ({
  gear,
  isEditMode,
  onSave,
  onEdit,
  onClose,
}) => {
  const manufacturer = gear.specs?.overview?.manufacturer || gear.specs?.manufacturer || '';
  const model = gear.specs?.overview?.model || gear.specs?.model || '';
  const title = [manufacturer, model].filter(Boolean).join(' ');

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b">
      <h1 className="text-2xl font-bold text-gray-900">{title || 'Untitled Gear'}</h1>
      <div className="flex items-center gap-4">
        {isEditMode ? (
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-4 py-2 text-white bg-[#EE5430] rounded hover:bg-[#D64A2A] transition-colors"
          >
            <FaSave />
            Save
          </button>
        ) : (
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            <FaEdit />
            Edit
          </button>
        )}
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          title="Close"
        >
          <FaTimes size={24} />
        </button>
      </div>
    </div>
  );
}; 
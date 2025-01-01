import React from 'react';
import { BaseGear, GearStatus, GearType } from '../../types/gear';
import { FaGuitar, FaMicrophone, FaHeadphones, FaMusic, FaTrash } from 'react-icons/fa';
import { GiGrandPiano, GiSpeaker } from 'react-icons/gi';

interface GearCardProps {
  gear: BaseGear;
  onClick?: () => void;
  onDelete?: () => void;
  onStatusChange?: (status: GearStatus) => void;
}

const GEAR_ICONS = {
  [GearType.Guitar]: FaGuitar,
  [GearType.Microphone]: FaMicrophone,
  [GearType.Headphones]: FaHeadphones,
  [GearType.Speakers]: GiSpeaker,
  [GearType.Piano]: GiGrandPiano,
  [GearType.Other]: FaMusic,
} as const;

const STATUS_OPTIONS = [
  {
    status: GearStatus.Own,
    label: 'Own',
    activeClass: 'bg-green-500 text-white',
    hoverClass: 'hover:bg-green-100',
  },
  {
    status: GearStatus.Want,
    label: 'Want',
    activeClass: 'bg-blue-500 text-white',
    hoverClass: 'hover:bg-blue-100',
  },
  {
    status: GearStatus.Sold,
    label: 'Sold',
    activeClass: 'bg-gray-500 text-white',
    hoverClass: 'hover:bg-gray-100',
  },
] as const;

export const GearCard: React.FC<GearCardProps> = ({ gear, onClick, onDelete, onStatusChange }) => {
  const Icon = GEAR_ICONS[gear.type] || GEAR_ICONS[GearType.Other];

  const handleStatusClick = (e: React.MouseEvent, status: GearStatus) => {
    e.stopPropagation();
    onStatusChange?.(status);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div 
      className="group bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-102 hover:shadow-lg relative"
      onClick={onClick}
    >
      <div className="relative h-48 sm:h-56 md:h-64 bg-gray-200">
        {gear.images && gear.images.length > 0 ? (
          <img
            src={gear.images[0].url}
            alt={`${gear.make} ${gear.model}`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            style={{ imageRendering: 'crisp-edges' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Icon size={48} />
          </div>
        )}
        
        {/* Status Toggle */}
        {onStatusChange && (
          <div className="absolute top-2 left-2 flex bg-white rounded-lg shadow-md overflow-hidden">
            {STATUS_OPTIONS.map(({ status, label, activeClass, hoverClass }) => (
              <button
                key={status}
                onClick={(e) => handleStatusClick(e, status)}
                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm transition-colors ${
                  gear.status === status ? activeClass : hoverClass
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute top-2 right-2 p-1.5 sm:p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-110"
            title="Delete gear"
          >
            <FaTrash size={14} className="sm:w-4 sm:h-4" />
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
          {gear.make} {gear.model}
        </h3>
        <p className="text-sm sm:text-base text-gray-600">
          {gear.type}
        </p>
      </div>
    </div>
  );
}; 
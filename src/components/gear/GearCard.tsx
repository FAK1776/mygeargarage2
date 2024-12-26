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

export const GearCard: React.FC<GearCardProps> = ({ gear, onClick, onDelete, onStatusChange }) => {
  const getIcon = (type: GearType) => {
    switch (type) {
      case GearType.Guitar:
        return <FaGuitar size={48} />;
      case GearType.Microphone:
        return <FaMicrophone size={48} />;
      case GearType.Headphones:
        return <FaHeadphones size={48} />;
      case GearType.Speakers:
        return <GiSpeaker size={48} />;
      case GearType.Piano:
        return <GiGrandPiano size={48} />;
      case GearType.Other:
      default:
        return <FaMusic size={48} />;
    }
  };

  const handleStatusClick = (e: React.MouseEvent, status: GearStatus) => {
    e.stopPropagation();
    if (onStatusChange) {
      onStatusChange(status);
    }
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
      <div className="relative h-64 bg-gray-200">
        {gear.images && gear.images.length > 0 ? (
          <img
            src={gear.images[0]}
            alt={`${gear.make} ${gear.model}`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            style={{ imageRendering: 'crisp-edges' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            {getIcon(gear.type)}
          </div>
        )}
        
        {/* Status Toggle */}
        <div className="absolute top-2 left-2 flex bg-white rounded-lg shadow-md overflow-hidden">
          <button
            onClick={(e) => handleStatusClick(e, GearStatus.Own)}
            className={`px-3 py-1 text-sm transition-colors ${
              gear.status === GearStatus.Own 
                ? 'bg-green-500 text-white' 
                : 'hover:bg-green-100'
            }`}
          >
            Own
          </button>
          <button
            onClick={(e) => handleStatusClick(e, GearStatus.Wishlist)}
            className={`px-3 py-1 text-sm transition-colors ${
              gear.status === GearStatus.Wishlist 
                ? 'bg-blue-500 text-white' 
                : 'hover:bg-blue-100'
            }`}
          >
            Want
          </button>
          <button
            onClick={(e) => handleStatusClick(e, GearStatus.Sold)}
            className={`px-3 py-1 text-sm transition-colors ${
              gear.status === GearStatus.Sold 
                ? 'bg-gray-500 text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            Sold
          </button>
        </div>

        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-110"
            title="Delete gear"
          >
            <FaTrash size={16} />
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {`${gear.make} ${gear.model}${gear.year ? ` (${gear.year})` : ''}`}
        </h3>
        <div className="mt-1 space-y-1">
          {gear.placeOfOrigin && (
            <p className="text-sm text-gray-600 truncate">
              Made in {gear.placeOfOrigin}
            </p>
          )}
          {gear.dateAcquired && (
            <p className="text-sm text-gray-500 truncate">
              Acquired {formatDate(gear.dateAcquired)}
            </p>
          )}
          {gear.specs?.body?.shape && (
            <p className="text-sm text-gray-600 truncate">
              {gear.specs.body.shape}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}; 
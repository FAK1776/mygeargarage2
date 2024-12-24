import React from 'react';
import { BaseGear } from '../../types/gear';
import { FaGuitar, FaMicrophone, FaHeadphones, FaMusic, FaTrash } from 'react-icons/fa';
import { GiGrandPiano, GiSpeaker } from 'react-icons/gi';

interface GearCardProps {
  gear: BaseGear;
  onClick?: () => void;
  onDelete?: () => void;
}

export const GearCard: React.FC<GearCardProps> = ({ gear, onClick, onDelete }) => {
  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'guitar':
        return <FaGuitar size={48} />;
      case 'microphone':
        return <FaMicrophone size={48} />;
      case 'headphones':
        return <FaHeadphones size={48} />;
      case 'speakers':
        return <GiSpeaker size={48} />;
      case 'piano':
        return <GiGrandPiano size={48} />;
      default:
        return <FaMusic size={48} />;
    }
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
            {getIcon(gear.category)}
          </div>
        )}
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
        {gear.specs?.body?.shape && (
          <p className="text-sm text-gray-600 mt-1 truncate">
            {gear.specs.body.shape}
          </p>
        )}
      </div>
    </div>
  );
}; 
import React from 'react';
import { BaseGear, GearStatus, GearType } from '../../types/gear';
import { FaGuitar, FaMicrophone, FaHeadphones, FaMusic, FaTrash } from 'react-icons/fa';
import { GiGrandPiano, GiSpeaker } from 'react-icons/gi';
import { theme } from '../../styles/theme';

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
    style: {
      active: {
        backgroundColor: theme.colors.state.success,
        color: theme.colors.text.inverse,
      },
      hover: {
        backgroundColor: '#1F8F3B', // Darker shade of success color
      },
    },
  },
  {
    status: GearStatus.Want,
    label: 'Want',
    style: {
      active: {
        backgroundColor: theme.colors.primary.gold,
        color: theme.colors.text.primary,
      },
      hover: {
        backgroundColor: theme.colors.primary.darkGold,
      },
    },
  },
  {
    status: GearStatus.Sold,
    label: 'Sold',
    style: {
      active: {
        backgroundColor: theme.colors.primary.steel,
        color: theme.colors.text.inverse,
      },
      hover: {
        backgroundColor: theme.colors.primary.gunmetal,
      },
    },
  },
] as const;

export const GearCard: React.FC<GearCardProps> = ({ gear, onClick, onDelete, onStatusChange }) => {
  const Icon = GEAR_ICONS[gear.type] || GEAR_ICONS[GearType.Other];

  const handleStatusClick = (e: React.MouseEvent, status: GearStatus) => {
    e.stopPropagation();
    onStatusChange?.(status);
  };

  return (
    <div 
      className="group bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-102 hover:shadow-lg relative"
      onClick={onClick}
      style={{
        borderColor: theme.colors.ui.border,
        '--tw-shadow': `0 4px 6px -1px rgba(60, 74, 87, 0.1), 0 2px 4px -1px rgba(60, 74, 87, 0.1)`,
      } as React.CSSProperties}
    >
      <div className="relative h-48 sm:h-56 md:h-64" style={{ backgroundColor: theme.colors.ui.backgroundAlt }}>
        {gear.images && gear.images.length > 0 ? (
          <img
            src={gear.images[0].url}
            alt={`${gear.make} ${gear.model}`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            style={{ imageRendering: 'crisp-edges' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ color: theme.colors.text.secondary }}>
            <Icon size={48} />
          </div>
        )}
        
        <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-2">
          {onStatusChange && (
            <div className="flex bg-white rounded-lg shadow-md overflow-hidden">
              {STATUS_OPTIONS.map(({ status, label, style }) => (
                <button
                  key={status}
                  onClick={(e) => handleStatusClick(e, status)}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium transition-colors"
                  style={{
                    ...(gear.status === status ? style.active : {
                      color: theme.colors.text.secondary,
                      ':hover': style.hover,
                    }),
                  }}
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
              className="p-1.5 sm:p-2 rounded-full transition-all duration-300 transform hover:scale-110 ml-2"
              style={{
                backgroundColor: theme.colors.state.error,
                color: theme.colors.text.inverse,
                ':hover': {
                  backgroundColor: '#C11D2B', // Darker shade of error color
                },
              }}
              title="Delete gear"
            >
              <FaTrash size={14} className="sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg sm:text-xl font-semibold mb-1" style={{ color: theme.colors.text.primary }}>
          {gear.specs?.overview?.manufacturer} {gear.specs?.overview?.model}
        </h3>
        <p className="text-sm sm:text-base" style={{ color: theme.colors.text.secondary }}>
          {gear.specs?.overview?.bodySizeShape || 'Body shape not specified'}
        </p>
      </div>
    </div>
  );
}; 
import React from 'react';
import { GearStatus } from '../../types/gear';

type FilterStatus = GearStatus | 'all';

interface StatusToggleProps {
  currentStatus: FilterStatus;
  onStatusChange: (status: FilterStatus) => void;
  className?: string;
}

interface StatusOption {
  status: FilterStatus;
  label: string;
  activeClass: string;
  hoverClass: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  {
    status: 'all',
    label: 'All',
    activeClass: 'bg-[#EE5430] text-white',
    hoverClass: 'hover:bg-gray-100',
  },
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
];

export const StatusToggle: React.FC<StatusToggleProps> = ({
  currentStatus,
  onStatusChange,
  className = '',
}) => {
  const handleStatusClick = (e: React.MouseEvent, status: FilterStatus) => {
    e.stopPropagation();
    onStatusChange(status);
  };

  return (
    <div className={`flex bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {STATUS_OPTIONS.map(({ status, label, activeClass, hoverClass }) => (
        <button
          key={status}
          onClick={(e) => handleStatusClick(e, status)}
          className={`px-3 py-1 text-sm transition-colors ${
            currentStatus === status ? activeClass : hoverClass
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}; 
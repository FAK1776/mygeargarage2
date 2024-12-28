import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { SortOption } from '../../hooks/useGearSort';

interface SortDropdownProps {
  options: SortOption[];
  currentSort: string;
  onSortChange: (sortId: string) => void;
  className?: string;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
  options,
  currentSort,
  onSortChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = options.find(option => option.id === currentSort);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center justify-between w-full px-4 py-2
          bg-white border border-gray-200 rounded-lg
          text-gray-700 font-medium
          hover:bg-gray-50 transition-colors
          focus:outline-none focus:ring-2 focus:ring-[#EE5430]/20
        "
      >
        <span>{currentOption?.label || 'Sort by'}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 ml-2 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="
          absolute z-10 w-full mt-1
          bg-white border border-gray-200 rounded-lg shadow-lg
          overflow-hidden
          animate-in fade-in slide-in-from-top-2 duration-200
        ">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onSortChange(option.id);
                setIsOpen(false);
              }}
              className={`
                w-full px-4 py-2 text-left
                transition-colors
                ${option.id === currentSort
                  ? 'bg-[#EE5430]/10 text-[#EE5430]'
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}; 
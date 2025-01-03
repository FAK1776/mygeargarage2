import { useState, useEffect } from 'react';
import { BaseGear, GearStatus } from '../types/gear';

type FilterStatus = GearStatus | 'all';

interface UseGearFiltersProps {
  gear: BaseGear[];
}

interface UseGearFiltersReturn {
  filteredGear: BaseGear[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: FilterStatus;
  setStatusFilter: (status: FilterStatus) => void;
}

export const useGearFilters = ({ gear }: UseGearFiltersProps): UseGearFiltersReturn => {
  const [filteredGear, setFilteredGear] = useState<BaseGear[]>(gear);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');

  useEffect(() => {
    let filtered = gear;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        // Search in basic guitar info
        if (
          item.make?.toLowerCase().includes(query) ||
          item.model?.toLowerCase().includes(query)
        ) {
          console.log(`Match in basic info for ${item.make} ${item.model}`);
          return true;
        }

        // Search in specifications
        const specs = item.specs;
        if (!specs) return false;
        
        // Helper function to search in an object's values
        const searchInObject = (obj: Record<string, any> | undefined, path: string = ''): boolean => {
          if (!obj || typeof obj !== 'object') return false;
          
          for (const [key, value] of Object.entries(obj)) {
            const currentPath = path ? `${path}.${key}` : key;
            
            // Search in string values
            if (typeof value === 'string') {
              if (value.toLowerCase().includes(query)) {
                console.log(`Match found in ${item.make} ${item.model} at ${currentPath}: "${value}"`);
                return true;
              }
            }
            
            // Search in boolean values
            if (typeof value === 'boolean') {
              const matches = query === 'true' ? value : query === 'false' ? !value : false;
              if (matches) {
                console.log(`Match found in ${item.make} ${item.model} at ${currentPath}: ${value}`);
                return true;
              }
            }
            
            // Search in nested objects (for nested specifications)
            if (value && typeof value === 'object') {
              if (searchInObject(value, currentPath)) {
                return true;
              }
            }
          }
          
          return false;
        };

        // Search in all specification categories
        return searchInObject(specs);
      });
    }

    setFilteredGear(filtered);
  }, [searchQuery, statusFilter, gear]);

  return {
    filteredGear,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
  };
}; 
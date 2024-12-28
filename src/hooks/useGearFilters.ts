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
        // Search in basic info
        if (
          item.make?.toLowerCase().includes(query) ||
          item.model?.toLowerCase().includes(query) ||
          item.serialNumber?.toLowerCase().includes(query)
        ) {
          return true;
        }

        // Search in specifications
        const specs = item.specs;
        
        // Helper function to search in an object's values
        const searchInObject = (obj: Record<string, any>) => {
          if (!obj || typeof obj !== 'object') return false;
          return Object.values(obj).some(value => 
            typeof value === 'string' && value.toLowerCase().includes(query)
          );
        };

        // Search in all specification categories
        return specs && (
          searchInObject(specs.body) ||
          searchInObject(specs.neck) ||
          searchInObject(specs.headstock) ||
          searchInObject(specs.hardware) ||
          searchInObject(specs.electronics) ||
          searchInObject(specs.extras)
        );
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
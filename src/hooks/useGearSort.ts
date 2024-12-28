import { useState, useEffect } from 'react';
import { BaseGear } from '../types/gear';

export type SortOption = {
  id: string;
  label: string;
  sortFn: (a: BaseGear, b: BaseGear) => number;
};

const SORT_OPTIONS: SortOption[] = [
  {
    id: 'recently-added',
    label: 'Recently Added',
    sortFn: (a, b) => {
      const dateA = a.dateAcquired ? new Date(a.dateAcquired).getTime() : 0;
      const dateB = b.dateAcquired ? new Date(b.dateAcquired).getTime() : 0;
      return dateB - dateA;
    }
  },
  {
    id: 'oldest-first',
    label: 'Oldest First',
    sortFn: (a, b) => {
      const dateA = a.dateAcquired ? new Date(a.dateAcquired).getTime() : 0;
      const dateB = b.dateAcquired ? new Date(b.dateAcquired).getTime() : 0;
      return dateA - dateB;
    }
  },
  {
    id: 'make-model-asc',
    label: 'Make & Model (A-Z)',
    sortFn: (a, b) => {
      const nameA = `${a.make} ${a.model}`.toLowerCase();
      const nameB = `${b.make} ${b.model}`.toLowerCase();
      return nameA.localeCompare(nameB);
    }
  },
  {
    id: 'make-model-desc',
    label: 'Make & Model (Z-A)',
    sortFn: (a, b) => {
      const nameA = `${a.make} ${a.model}`.toLowerCase();
      const nameB = `${b.make} ${b.model}`.toLowerCase();
      return nameB.localeCompare(nameA);
    }
  },
  {
    id: 'year-newest',
    label: 'Year (Newest)',
    sortFn: (a, b) => {
      const yearA = a.year ? parseInt(a.year) : 0;
      const yearB = b.year ? parseInt(b.year) : 0;
      return yearB - yearA;
    }
  },
  {
    id: 'year-oldest',
    label: 'Year (Oldest)',
    sortFn: (a, b) => {
      const yearA = a.year ? parseInt(a.year) : 0;
      const yearB = b.year ? parseInt(b.year) : 0;
      return yearA - yearB;
    }
  }
];

interface UseGearSortProps {
  gear: BaseGear[];
}

interface UseGearSortReturn {
  sortedGear: BaseGear[];
  currentSort: string;
  setCurrentSort: (sortId: string) => void;
  sortOptions: SortOption[];
}

export const useGearSort = ({ gear }: UseGearSortProps): UseGearSortReturn => {
  const [currentSort, setCurrentSort] = useState('recently-added');
  const [sortedGear, setSortedGear] = useState<BaseGear[]>(gear);

  useEffect(() => {
    const selectedSort = SORT_OPTIONS.find(option => option.id === currentSort);
    if (!selectedSort) return;

    const sorted = [...gear].sort(selectedSort.sortFn);
    setSortedGear(sorted);
  }, [currentSort, gear]);

  return {
    sortedGear,
    currentSort,
    setCurrentSort,
    sortOptions: SORT_OPTIONS
  };
}; 
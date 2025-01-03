import { Timestamp } from 'firebase/firestore';

export interface MaintenanceSchedule {
  id: string;
  userId: string;
  guitarId: string;
  maintenanceTypeId: string;
  initialDueDate: Timestamp;
  intervalDays: number;
  isActive: boolean;
  notes?: string;
  autoReschedule: boolean;
  lastCompletedDate?: Timestamp;
  nextDueDate: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isCompleted: boolean;
}

export interface MaintenanceRecord {
  id: string;
  userId: string;
  scheduleId: string;
  guitarId: string;
  maintenanceTypeId: string;
  completedDate: Timestamp;
  notes?: string;
  nextScheduledDate?: Timestamp;
  createdAt: Timestamp;
}

export interface MaintenanceType {
  id: string;
  name: string;
  interval: number;
  description: string;
  isPredefined: boolean;
}

// Maintenance status types
export type MaintenanceStatus = 'overdue' | 'due-soon' | 'upcoming' | 'completed';

// Constants for maintenance scheduling
export const MAINTENANCE_CONSTANTS = {
  DUE_SOON_DAYS: 7, // Tasks due within 7 days are considered "due soon"
  PREDEFINED_TYPES: [
    { 
      id: 'string-change',
      name: 'String Change',
      interval: 90,
      description: 'Replace guitar strings for optimal tone and playability',
      isPredefined: true
    },
    { 
      id: 'electronics-cleaning',
      name: 'Electronics & Metal Cleaning',
      interval: 30,
      description: 'Clean metal components and electronics with contact cleaner',
      isPredefined: true
    },
    { 
      id: 'tuning-trussrod',
      name: 'Tuning & Truss Rod Check',
      interval: 30,
      description: 'Check tuning stability and minor truss rod adjustments',
      isPredefined: true
    },
    { 
      id: 'fret-neck',
      name: 'Fret & Neck Inspection',
      interval: 90,
      description: 'Inspect for fret wear, neck relief, and loose components',
      isPredefined: true
    },
    { 
      id: 'humidity-check',
      name: 'Humidity Check',
      interval: 30,
      description: 'Check and adjust humidity levels to protect your instrument',
      isPredefined: true
    },
    { 
      id: 'pro-setup',
      name: 'Professional Setup',
      interval: 365,
      description: 'Full setup including action, intonation, and pickup adjustments',
      isPredefined: true
    }
  ] as const
}; 
import { Timestamp } from 'firebase/firestore';

// Enum for gear status
export enum GearStatus {
  Own = 'own',
  Want = 'want',
  Sold = 'sold'
}

// Enum for gear types
export enum GearType {
  Guitar = 'guitar',
  Bass = 'bass',
  Microphone = 'microphone',
  Headphones = 'headphones',
  Speakers = 'speakers',
  Piano = 'piano',
  Other = 'other'
}

export interface Guitar {
  id: string;
  userId: string;
  name: string;
  type: GearType;
  status: GearStatus;
  make: string;
  model: string;
  year?: number;
  serialNumber?: string;
  purchaseDate?: Timestamp;
  purchasePrice?: number;
  currentValue?: number;
  condition?: string;
  description?: string;
  specs?: {
    [key: string]: string | number | boolean;
  };
  images?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Service/Maintenance Record
export interface ServiceRecord {
  id: string;
  date: Date;
  type: string;
  description: string;
  provider: string;
  cost: number;
  notes?: string;
  attachments?: string[];
}

// History Record Types
export type HistoryRecordType = 'ownership' | 'modification' | 'maintenance' | 'repairs';

// Base History Record interface
interface BaseHistoryRecord {
  id: string;
  date: Date;
  description: string;
  provider?: string;
  cost?: number;
  notes?: string;
  attachments?: string[];
  type: HistoryRecordType;
}

// History Record
export interface HistoryRecord extends BaseHistoryRecord {
  tags: HistoryRecordType[];
} 
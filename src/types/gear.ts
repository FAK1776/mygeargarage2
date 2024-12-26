// Enum for main gear types
export enum GearType {
  Guitar = 'Guitar',
  Bass = 'Bass',
  Microphone = 'Microphone',
  Headphones = 'Headphones',
  Speakers = 'Speakers',
  Piano = 'Piano',
  Other = 'Other'
}

// Enum for gear status
export enum GearStatus {
  Own = 'own',
  Wishlist = 'wishlist',
  Sold = 'sold'
}

// Guitar specifications interface
export interface GuitarSpecs {
  // Body
  body: {
    shape: string;
    size: string;  // e.g., "D-14 Fret"
    type: string;
    material: string;
    topBack: string;
    finish: string;
    depth: string;
    binding: string;
    bracing: {
      pattern: string;  // e.g., "X-Brace"
      shape: string;   // e.g., "Scalloped"
    };
    cutaway: string;
    topColor: string;
    rosette: {
      type: string;
      detail: string;  // e.g., "Abalone with Multi-Stripe"
    };
    endpiece: {
      material: string;
      inlay: string;  // e.g., "Multi-Stripe"
    };
  };

  // Neck
  neck: {
    material: string;
    shape: string;
    thickness: string;
    construction: string;
    finish: string;
    scaleLength: string;
    heelcap: string;  // Material or color
    fingerboard: {
      material: string;
      radius: string;
      widthAt12thFret: string;  // e.g., "2 1/8''"
      inlays: string;
      binding: string;
      sideDots: string;
    };
    numberOfFrets: string;
    fretSize: string;
    nut: {
      material: string;
      width: string;
    };
  };

  // Headstock
  headstock: {
    shape: string;
    binding: string;
    tuningMachines: string;
    headplateLogo: string;
  };

  // Hardware
  hardware: {
    bridge: string;
    tailpiece: string;
    finish: string;
    pickguard: {
      type: string;
      inlay: string;  // e.g., "None" or specific inlay pattern
    };
    knobs: string;
    strapButtons: string;
  };

  // Electronics
  electronics: {
    pickupSystem: string;
    neckPickup: string;
    bridgePickup: string;
    pickupConfiguration: string;
    controls: string;
    pickupSwitching: string;
    auxiliarySwitching: string;
  };

  // Extras
  extras: {
    recommendedStrings: string;  // e.g., "Authentic Acoustic Lifespan® 2.0 Phosphor Bronze - Medium"
    strings: string;
    caseOrGigBag: string;
    modificationsRepairs: string;
    uniqueFeatures: string;
  };
}

// Interface for the search index
export interface GearSearchIndex {
  gearId: string;
  type: GearType;
  searchableText: string;
  specs: GuitarSpecs;
}

// Service/Maintenance Record
export interface ServiceRecord {
  id: string;
  date: Date;
  type: string;  // e.g., "Setup", "Repair", "Maintenance"
  description: string;
  provider: string;  // Service provider or technician
  cost: number;
  notes?: string;
  attachments?: string[];  // URLs to receipts, documentation, etc.
}

// Ownership Record
export interface OwnershipRecord {
  id: string;
  ownerName: string;
  acquiredDate: Date;
  soldDate?: Date;
  location: string;  // Where the gear was during this ownership
  purchasePrice?: number;
  salePrice?: number;
  notes?: string;
  attachments?: string[];  // URLs to receipts, documentation, etc.
}

// Modification Record
export interface ModificationRecord {
  id: string;
  date: Date;
  type: string;  // e.g., "Upgrade", "Replacement", "Custom Work"
  description: string;
  provider: string;  // Who performed the modification
  cost: number;
  reversible: boolean;
  notes?: string;
  attachments?: string[];  // URLs to documentation, before/after photos, etc.
}

// Base interface for all gear types
export interface BaseGear {
  id: string;
  userId: string;
  type: GearType;  // Required field
  make: string;
  model: string;
  year?: string;
  modelNumber?: string;
  series?: string;
  serialNumber?: string;
  orientation?: string;
  numberOfStrings?: string;
  weight?: string;
  description?: string;
  subcategory?: string;
  createdAt: Date;
  updatedAt: Date;
  specs?: Record<string, any>;
  images: string[];  // Array of Base64 encoded images
  status: GearStatus;  // New field
  
  // New fields
  placeOfOrigin?: string;
  dateAcquired?: Date;
  dateSold?: Date;
  pricePaid?: number;
  priceSold?: number;
  acquisitionNotes?: string;
  saleNotes?: string;
  label?: string;  // For commemorative or custom guitars
  pleked?: boolean;  // Whether the guitar has been Plek processed
  serviceHistory?: ServiceRecord[];
  ownershipHistory?: OwnershipRecord[];
  modificationHistory?: ModificationRecord[];
}

// GearFormData now includes all fields except id, userId, createdAt, and updatedAt
export type GearFormData = Omit<BaseGear, 'id' | 'userId' | 'createdAt' | 'updatedAt'>; 
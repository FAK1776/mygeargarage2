// Enum for main gear types
export enum GearType {
  Guitar = 'Guitar'
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
    type: string;
    material: string;
    topBack: string;
    finish: string;
    depth: string;
    binding: string;
    bracing: string;
    cutaway: string;
    topColor: string;
  };

  // Neck
  neck: {
    material: string;
    shape: string;
    thickness: string;
    construction: string;
    finish: string;
    scaleLength: string;
    fingerboardMaterial: string;
    fingerboardRadius: string;
    numberOfFrets: string;
    fretSize: string;
    nutMaterial: string;
    nutWidth: string;
    fingerboardInlays: string;
    binding: string;
    sideDots: string;
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
    pickguard: string;
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

export type GearFormData = Omit<BaseGear, 'id' | 'userId' | 'createdAt' | 'updatedAt'>; 

// Base interface for all gear types
export interface BaseGear {
  id: string;
  userId: string;
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
  category?: string;
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
} 
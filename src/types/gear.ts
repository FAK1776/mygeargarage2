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
  Want = 'want',
  Sold = 'sold'
}

// Guitar specifications interface
export interface GuitarSpecs {
  // Overview (Category Order: 1)
  overview: {
    manufacturer: string;
    model: string;
    bodySizeShape: string;
    series: string;
    buildType: string;
    topMaterial: string;
    bodyMaterial: string;
    scaleLength: string;
    nutWidth: string;
    neckShapeProfile: string;
    neckTypeConstruction: string;
    pickupConfiguration: string;
    countryOfOrigin: string;
    serialNumber: string;
  };

  // Top (Category Order: 2)
  top: {
    color: string;
    finish: string;
    binding: string;
    inlayMaterial: string;
    detail: string;
    bridgeStyle: string;
    rosette: string;
    bridgeStringSpacing: string;
    bridgeMaterial: string;
    bridgePinMaterial: string;
    bridgePinDots: string;
    saddle: string;
    saddleRadius: string;
  };

  // Body (Category Order: 3)
  body: {
    design: {
      color: string;
      finish: string;
      binding: string;
      backPurfling: string;
      backInlayMaterial: string;
      backDetail: string;
      sideDetail: string;
      sideInlayMaterial: string;
      endpiece: string;
      endpieceInlay: string;
      heelcap: string;
    };
    bracing: {
      bodyBracing: string;
      bracingPattern: string;
      braceShape: string;
      braceMaterial: string;
      braceSize: string;
    };
    dimensions: {
      bodyDepth: string;
      upperBoutWidth: string;
      upperBoutDepth: string;
      lowerBoutWidth: string;
      lowerBoutDepth: string;
    };
  };

  // Neck & Headstock (Category Order: 4)
  neckAndHeadstock: {
    neck: {
      taper: string;
      material: string;
      color: string;
      finish: string;
      binding: string;
      numberOfFrets: string;
      joinsBodyAt: string;
      sideDots: string;
      trussRodType: string;
      nutMaterial: string;
    };
    fingerboard: {
      material: string;
      radius: string;
      widthAt12thFret: string;
      inlayStyle: string;
      inlayMaterial: string;
      bindingMaterial: string;
      rolledEdges: string;
      fretSize: string;
      fretMarkerStyle: string;
    };
    headstock: {
      shape: string;
      plateMaterial: string;
      logoStyle: string;
      bindingMaterial: string;
      detail: string;
    };
  };

  // Electronics (Category Order: 5)
  electronics: {
    acousticPickup: string;
    numberOfPickups: string;
    bridgePickup: string;
    middlePickup: string;
    neckPickup: string;
    pickupColor: string;
    controls: string;
    pickupSwitching: string;
    outputType: string;
    specialElectronics: string;
  };

  // Hardware (Category Order: 6)
  hardware: {
    bridge: string;
    finish: string;
    tuningMachines: string;
    tuningMachineKnobs: string;
    tailpiece: string;
    pickguard: string;
    pickguardInlay: string;
    controlKnobs: string;
    switchTip: string;
    neckPlate: string;
    strapButtons: string;
  };

  // Miscellaneous (Category Order: 7)
  miscellaneous: {
    pleked: boolean;
    label: string;
    case: string;
    recommendedStrings: string;
    weight: string;
    orientation: string;
    comments: string;
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
  type: string;
  description: string;
  provider: string;
  cost: number;
  notes?: string;
  attachments?: string[];
}

// Ownership Record
export interface OwnershipRecord {
  id: string;
  ownerName: string;
  acquiredDate: Date;
  soldDate?: Date;
  location: string;
  purchasePrice?: number;
  salePrice?: number;
  notes?: string;
  attachments?: string[];
}

// Modification Record
export interface ModificationRecord {
  id: string;
  date: Date;
  type: string;
  description: string;
  provider: string;
  cost: number;
  reversible: boolean;
  notes?: string;
  attachments?: string[];
}

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

// Base interface for all gear types
export interface BaseGear {
  id: string;
  userId: string;
  type: GearType;
  status: GearStatus;
  specs?: GuitarSpecs;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  serviceHistory?: HistoryRecord[];
}

// GearFormData now includes all fields except id, userId, createdAt, and updatedAt
export type GearFormData = Omit<BaseGear, 'id' | 'userId' | 'createdAt' | 'updatedAt'>; 
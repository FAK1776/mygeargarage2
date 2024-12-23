// Base interface for all gear types
export interface BaseGear {
  id: string;
  userId: string;
  name: string;
  brand: string;
  model: string;
  type: GearType;
  category?: string;
  subcategory?: string;
  description?: string;
  imageUrl?: string;
  specs: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Enum for main gear types
export enum GearType {
  Guitar = 'Guitar',
  Bass = 'Bass',
  Amplifier = 'Amplifier',
  Pedal = 'Pedal',
  Microphone = 'Microphone',
  Interface = 'Interface',
  Other = 'Other'
}

// Example of a specific gear type interface
export interface Guitar extends BaseGear {
  type: GearType.Guitar;
  specs: {
    body: {
      type: string;
      wood: string;
      finish: string;
    };
    neck: {
      wood: string;
      profile: string;
      radius: string;
      frets: number;
    };
    electronics?: {
      pickups: string[];
      controls: string[];
      preamp?: boolean;
    };
  };
}

// Interface for the search index
export interface GearSearchIndex {
  gearId: string;
  type: GearType;
  searchableText: string;
  specs: Record<string, any>;
  category: string;
  subcategory?: string;
}

export interface GuitarSpecs {
  body: {
    type: string;
    wood: string;
    finish: string;
  };
  neck: {
    wood: string;
    profile: string;
    radius: string;
    frets: number;
  };
  electronics?: {
    pickups: string[];
    controls: string[];
    preamp?: boolean;
  };
}

export interface BassSpecs {
  body: {
    type: string;
    wood: string;
    finish: string;
  };
  neck: {
    wood: string;
    profile: string;
    radius: string;
    frets: number;
  };
  electronics: {
    pickups: string[];
    controls: string[];
    preamp?: boolean;
  };
}

export interface AmplifierSpecs {
  type: 'tube' | 'solid-state' | 'hybrid' | 'modeling';
  power: {
    watts: number;
    channels: number;
  };
  features: string[];
  effects?: string[];
}

export interface PedalSpecs {
  type: string;
  effects: string[];
  controls: string[];
  bypass: 'true bypass' | 'buffered' | 'other';
  power: {
    voltage: number;
    current: number;
  };
}

export interface MicrophoneSpecs {
  type: 'dynamic' | 'condenser' | 'ribbon' | 'other';
  pattern: string[];
  frequency: {
    low: number;
    high: number;
  };
  impedance: number;
  sensitivity: string;
}

export interface InterfaceSpecs {
  inputs: {
    analog: number;
    digital: number;
    midi?: boolean;
  };
  outputs: {
    analog: number;
    digital: number;
    midi?: boolean;
  };
  sampleRate: number[];
  bitDepth: number[];
  features: string[];
}

export type GearSpecs = 
  | GuitarSpecs 
  | BassSpecs 
  | AmplifierSpecs 
  | PedalSpecs 
  | MicrophoneSpecs 
  | InterfaceSpecs 
  | Record<string, any>; 
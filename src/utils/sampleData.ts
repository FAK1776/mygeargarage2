import { GearService } from '../services/gearService';
import { GearStatus, GearType } from '../types/gear';

const sampleGear = [
  {
    make: 'Fender',
    model: 'Stratocaster',
    type: GearType.Guitar,
    status: GearStatus.Own,
    year: '2022',
    specs: {
      body: {
        material: 'Alder',
        finish: 'Sunburst',
        type: 'Solid Body',
      },
      neck: {
        material: 'Maple',
        profile: 'Modern C',
        fretboard: 'Rosewood',
        frets: '22 Medium Jumbo',
      },
      electronics: {
        pickups: '3x Single Coil',
        controls: 'Volume, 2x Tone, 5-way Switch',
      },
    },
  },
  {
    make: 'Martin',
    model: 'D-28',
    type: GearType.Guitar,
    status: GearStatus.Want,
    year: '2020',
    specs: {
      body: {
        material: 'Sitka Spruce Top, East Indian Rosewood Back and Sides',
        finish: 'Natural',
        type: 'Dreadnought',
        bracing: 'Forward Shifted X-Bracing',
      },
      neck: {
        material: 'Mahogany',
        profile: 'Modified Low Oval',
        fretboard: 'Ebony',
        scale: '25.4"',
      },
    },
  },
  {
    make: 'Gibson',
    model: 'Les Paul Standard',
    type: GearType.Guitar,
    status: GearStatus.Own,
    year: '2021',
    specs: {
      body: {
        material: 'Mahogany with Maple Top',
        finish: 'Heritage Cherry Sunburst',
        type: 'Solid Body',
      },
      neck: {
        material: 'Mahogany',
        profile: '59 Rounded',
        fretboard: 'Rosewood',
        frets: '22 Medium Jumbo',
      },
      electronics: {
        pickups: '2x Humbucker (Burstbucker)',
        controls: '2x Volume, 2x Tone, 3-way Switch',
      },
    },
  },
  {
    make: 'Gretsch',
    model: 'G6120T Nashville',
    type: GearType.Guitar,
    status: GearStatus.Want,
    year: '2023',
    specs: {
      body: {
        material: 'Maple, Laminated',
        finish: 'Orange Stain',
        type: 'Hollow Body',
      },
      neck: {
        material: 'Maple',
        profile: 'Standard U',
        fretboard: 'Ebony',
        frets: '22 Medium Jumbo',
      },
      electronics: {
        pickups: '2x Filter\'Tron Humbuckers',
        controls: '2x Volume, 2x Tone, 3-way Switch',
      },
      hardware: {
        bridge: 'Bigsby B6',
        tuners: 'Gotoh Locking',
      },
    },
  },
  {
    make: 'Taylor',
    model: '814ce',
    type: GearType.Guitar,
    status: GearStatus.Want,
    year: '2023',
    specs: {
      body: {
        material: 'Indian Rosewood back/sides, Sitka Spruce top',
        finish: 'Gloss Natural',
        type: 'Grand Auditorium',
        bracing: 'V-Class',
      },
      neck: {
        material: 'Tropical Mahogany',
        profile: 'Standard',
        fretboard: 'West African Ebony',
        scale: '25.5"',
      },
      electronics: {
        system: 'Expression System 2',
        controls: 'Volume, Bass, Treble',
      },
    },
  },
];

export const loadSampleData = async (userId: string) => {
  const gearService = new GearService();
  
  // Add sample gear without clearing existing gear
  await Promise.all(sampleGear.map(gear => gearService.addGear(userId, gear)));
}; 
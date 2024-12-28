import { GearService } from '../services/gearService';
import { GearStatus, GearType } from '../types/gear';
import { Timestamp } from 'firebase/firestore';

const sampleGear = [
  {
    make: 'Martin',
    model: 'D-28',
    type: GearType.Guitar,
    status: GearStatus.Own,
    year: '2018',
    dateAcquired: Timestamp.fromDate(new Date('2018-03-15')),
    pricePaid: 3299,
    acquisitionNotes: 'Purchased new from Elderly Instruments',
    specs: {
      body: {
        material: 'East Indian Rosewood back and sides, Sitka Spruce top',
        finish: 'Gloss Nitrocellulose',
        type: 'Dreadnought',
        bracing: 'Forward-Shifted X-Bracing',
        binding: 'Style 28 with White Boltaron',
        depth: '4.84"'
      },
      neck: {
        material: 'Select Hardwood',
        profile: 'Modified Low Oval',
        fretboard: 'Ebony',
        scale: '25.4"',
        frets: '20'
      }
    },
    serviceHistory: [
      {
        id: 'srv-001',
        date: Timestamp.fromDate(new Date('2019-06-20')),
        type: 'Setup',
        description: 'Full setup and fret polish',
        provider: 'Elderly Instruments',
        cost: 150,
        notes: 'Adjusted action, new bone saddle installed'
      },
      {
        id: 'srv-002',
        date: Timestamp.fromDate(new Date('2020-08-15')),
        type: 'Maintenance',
        description: 'String change and cleaning',
        provider: 'Self',
        cost: 18,
        notes: 'Martin SP Phosphor Bronze Light strings'
      },
      {
        id: 'srv-003',
        date: Timestamp.fromDate(new Date('2022-02-10')),
        type: 'Repair',
        description: 'Bridge reglue',
        provider: 'Martin Factory',
        cost: 450,
        notes: 'Warranty work - bridge lifting slightly at corner'
      }
    ]
  },
  {
    make: 'Gretsch',
    model: 'G6136T White Falcon',
    type: GearType.Guitar,
    status: GearStatus.Sold,
    year: '2019',
    dateAcquired: Timestamp.fromDate(new Date('2019-07-01')),
    dateSold: Timestamp.fromDate(new Date('2023-09-15')),
    pricePaid: 3799,
    priceSold: 3500,
    acquisitionNotes: 'Found at Chicago Music Exchange',
    saleNotes: 'Sold to fund Martin OM-28 purchase',
    specs: {
      body: {
        material: 'Laminated Maple',
        finish: 'Gloss White with Gold Sparkle Binding',
        type: 'Hollow Body',
        bracing: 'Sound-post',
        binding: 'Multi-ply with Gold Sparkle',
        depth: '2.75"'
      },
      neck: {
        material: 'Maple',
        profile: 'Standard U',
        fretboard: 'Ebony',
        scale: '25.5"',
        frets: '22'
      },
      electronics: {
        pickups: 'TV Jones® Classic',
        controls: 'Dual Volume, Tone, Master Volume',
        configuration: 'Dual Humbucker'
      }
    },
    serviceHistory: [
      {
        id: 'srv-004',
        date: Timestamp.fromDate(new Date('2020-03-10')),
        type: 'Setup',
        description: 'Full setup and Bigsby adjustment',
        provider: 'Chicago Music Exchange',
        cost: 175,
        notes: 'Included new strings and intonation'
      },
      {
        id: 'srv-005',
        date: Timestamp.fromDate(new Date('2021-11-20')),
        type: 'Repair',
        description: 'Electronics repair',
        provider: 'Local Tech',
        cost: 120,
        notes: 'Fixed intermittent output jack issue'
      }
    ]
  },
  {
    make: 'Gibson',
    model: 'Style 0 Dobro',
    type: GearType.Guitar,
    status: GearStatus.Own,
    year: '2021',
    dateAcquired: Timestamp.fromDate(new Date('2021-04-15')),
    pricePaid: 2899,
    acquisitionNotes: 'Special order through local dealer',
    specs: {
      body: {
        material: 'Mahogany with Spider Cone Resonator',
        finish: 'Vintage Sunburst',
        type: 'Resonator',
        bracing: 'Sound-well Construction',
        binding: 'Multi-ply',
        depth: '3.5"'
      },
      neck: {
        material: 'Mahogany',
        profile: 'Round',
        fretboard: 'Rosewood',
        scale: '25"',
        frets: '19'
      }
    },
    serviceHistory: [
      {
        id: 'srv-006',
        date: Timestamp.fromDate(new Date('2022-08-12')),
        type: 'Setup',
        description: 'Setup for slide playing',
        provider: 'Specialty Guitar Works',
        cost: 200,
        notes: 'Raised action, cone adjustment'
      }
    ]
  },
  {
    make: 'Deering',
    model: 'Sierra 5-String',
    type: GearType.Other,
    status: GearStatus.Own,
    year: '2020',
    dateAcquired: Timestamp.fromDate(new Date('2020-12-25')),
    pricePaid: 2199,
    acquisitionNotes: 'Christmas gift from family',
    specs: {
      body: {
        material: 'Three-ply Maple Rim',
        finish: 'High Gloss',
        type: 'Resonator Banjo',
        depth: '2.75"'
      },
      neck: {
        material: 'Maple',
        profile: 'Standard',
        fretboard: 'Ebony',
        scale: '26.25"',
        frets: '22'
      }
    },
    serviceHistory: [
      {
        id: 'srv-007',
        date: Timestamp.fromDate(new Date('2021-06-15')),
        type: 'Setup',
        description: 'Head tension adjustment and bridge fitting',
        provider: 'Banjo Specialist',
        cost: 150,
        notes: 'Also included new strings and head cleaning'
      },
      {
        id: 'srv-008',
        date: Timestamp.fromDate(new Date('2023-01-20')),
        type: 'Maintenance',
        description: 'Tension hoop adjustment',
        provider: 'Self',
        cost: 0,
        notes: 'Regular maintenance check and cleaning'
      }
    ]
  },
  {
    make: 'Martin',
    model: 'OM-28',
    type: GearType.Guitar,
    status: GearStatus.Own,
    year: '2023',
    dateAcquired: Timestamp.fromDate(new Date('2023-09-20')),
    pricePaid: 3699,
    acquisitionNotes: 'Purchased with proceeds from White Falcon sale',
    specs: {
      body: {
        material: 'East Indian Rosewood back and sides, Sitka Spruce top',
        finish: 'Gloss Nitrocellulose',
        type: 'Orchestra Model',
        bracing: 'Scalloped X-Bracing',
        binding: 'Style 28 with White Boltaron',
        depth: '4.125"'
      },
      neck: {
        material: 'Select Hardwood',
        profile: 'Modified Low Oval',
        fretboard: 'Ebony',
        scale: '25.4"',
        frets: '20'
      }
    },
    serviceHistory: [
      {
        id: 'srv-009',
        date: Timestamp.fromDate(new Date('2023-10-05')),
        type: 'Setup',
        description: 'Initial setup and optimization',
        provider: 'Elderly Instruments',
        cost: 165,
        notes: 'Setup to factory specs with custom string height'
      }
    ]
  },
  {
    make: 'Rickenbacker',
    model: '360',
    type: GearType.Guitar,
    status: GearStatus.Sold,
    year: '2017',
    dateAcquired: Timestamp.fromDate(new Date('2017-11-30')),
    dateSold: Timestamp.fromDate(new Date('2021-02-15')),
    pricePaid: 2499,
    priceSold: 2800,
    acquisitionNotes: 'Found at Guitar Center, Fireglo finish',
    saleNotes: 'Sold to help fund Gibson Dobro purchase',
    specs: {
      body: {
        material: 'Maple',
        finish: 'Fireglo',
        type: 'Semi-Hollow',
        binding: 'White',
        depth: '1.5"'
      },
      neck: {
        material: 'Maple',
        profile: 'C Shape',
        fretboard: 'Rosewood',
        scale: '24.75"',
        frets: '24'
      },
      electronics: {
        pickups: 'High-gain Single-coil',
        controls: 'Volume, Tone, Blend',
        configuration: 'Dual Single-coil'
      }
    },
    serviceHistory: [
      {
        id: 'srv-010',
        date: Timestamp.fromDate(new Date('2018-05-20')),
        type: 'Setup',
        description: 'Full setup and electronics check',
        provider: 'Guitar Center',
        cost: 135,
        notes: 'Included fret polish and new strings'
      },
      {
        id: 'srv-011',
        date: Timestamp.fromDate(new Date('2019-09-15')),
        type: 'Repair',
        description: 'Replace output jack',
        provider: 'Local Tech',
        cost: 85,
        notes: 'Upgraded to Switchcraft jack'
      },
      {
        id: 'srv-012',
        date: Timestamp.fromDate(new Date('2020-07-01')),
        type: 'Maintenance',
        description: 'Fret level and crown',
        provider: 'Professional Luthier',
        cost: 250,
        notes: 'Addressed some fret wear in first position'
      }
    ]
  }
];

export const loadSampleData = async (userId: string) => {
  const gearService = new GearService();
  
  // Add sample gear without clearing existing gear
  await Promise.all(sampleGear.map(gear => gearService.addGear(userId, gear)));
}; 
import { GearType, GearStatus } from '../types/gear';
import { Timestamp } from 'firebase/firestore';

// Define the structure of a CSV row
interface CSVExample {
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
}

// Service history types and templates
type ServiceType = 'Setup' | 'Repair' | 'Modification' | 'Maintenance';

interface ServiceTemplate {
  type: ServiceType;
  descriptions: string[];
  providers: string[];
  costRange: [number, number];
  noteTemplates: string[];
}

const serviceTemplates: Record<ServiceType, ServiceTemplate> = {
  Setup: {
    type: 'Setup',
    descriptions: [
      'Initial setup and inspection',
      'Full setup with action adjustment',
      'Professional setup and intonation',
      'Setup with string height optimization',
      'Seasonal setup and adjustment'
    ],
    providers: [
      'Local Guitar Shop',
      'Professional Luthier',
      'Guitar Center',
      'Authorized Dealer Service',
      'Custom Shop'
    ],
    costRange: [100, 250],
    noteTemplates: [
      'Adjusted action and intonation',
      'New strings and fret polish included',
      'Setup to factory specifications',
      'Custom string height per player preference',
      'Included neck relief adjustment'
    ]
  },
  Repair: {
    type: 'Repair',
    descriptions: [
      'Bridge reglue',
      'Fret leveling and crown',
      'Electronics repair',
      'Nut replacement',
      'Crack repair',
      'Tuner replacement',
      'Output jack repair'
    ],
    providers: [
      'Professional Luthier',
      'Authorized Repair Center',
      'Local Guitar Tech',
      'Factory Service Center',
      'Specialty Repair Shop'
    ],
    costRange: [150, 500],
    noteTemplates: [
      'Warranty repair completed',
      'Preventative maintenance performed',
      'Included setup after repair',
      'Used original spec parts',
      'Upgraded to higher quality components'
    ]
  },
  Modification: {
    type: 'Modification',
    descriptions: [
      'Pickup upgrade',
      'Bridge replacement',
      'Tuner upgrade',
      'Electronics upgrade',
      'Nut replacement with bone',
      'Fret upgrade to stainless steel',
      'Added shielding to cavities'
    ],
    providers: [
      'Custom Shop',
      'Professional Luthier',
      'Specialty Guitar Works',
      'Boutique Guitar Shop',
      'Master Builder'
    ],
    costRange: [200, 800],
    noteTemplates: [
      'Significant improvement in tone',
      'Better tuning stability achieved',
      'Custom work to specifications',
      'Upgraded to premium components',
      'Reversible modification'
    ]
  },
  Maintenance: {
    type: 'Maintenance',
    descriptions: [
      'String change and cleaning',
      'Fret polish',
      'Deep cleaning and conditioning',
      'Humidity adjustment',
      'General maintenance check'
    ],
    providers: [
      'Self',
      'Local Guitar Shop',
      'Guitar Tech',
      'Professional Luthier',
      'Music Store'
    ],
    costRange: [0, 150],
    noteTemplates: [
      'Regular maintenance service',
      'Preventative care performed',
      'Included minor adjustments',
      'Fresh strings and setup check',
      'General health check completed'
    ]
  }
};

// Generate a random date within a range
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate random service history
const generateServiceHistory = (index: number, acquiredDate: Date) => {
  const now = new Date();
  const serviceHistory = [];
  const numServices = Math.floor(Math.random() * 4) + 1; // 1-4 services

  // Initial setup service
  const initialSetup = {
    id: `srv-sample-${index}-1`,
    date: Timestamp.fromDate(new Date(acquiredDate.getTime() + 7 * 24 * 60 * 60 * 1000)), // 1 week after acquisition
    type: 'Setup' as ServiceType,
    description: 'Initial setup and inspection',
    provider: serviceTemplates.Setup.providers[Math.floor(Math.random() * serviceTemplates.Setup.providers.length)],
    cost: Number(Math.floor(Math.random() * (200 - 100) + 100)), // Ensure cost is a number
    notes: 'Factory setup with string height adjustment'
  };
  serviceHistory.push(initialSetup);

  // Additional random services
  for (let i = 2; i <= numServices; i++) {
    const serviceTypes = Object.keys(serviceTemplates) as ServiceType[];
    const serviceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
    const template = serviceTemplates[serviceType];
    
    const serviceDate = randomDate(
      new Date(acquiredDate.getTime() + 30 * 24 * 60 * 60 * 1000), // At least 30 days after acquisition
      now
    );

    const service = {
      id: `srv-sample-${index}-${i}`,
      date: Timestamp.fromDate(serviceDate),
      type: template.type,
      description: template.descriptions[Math.floor(Math.random() * template.descriptions.length)],
      provider: template.providers[Math.floor(Math.random() * template.providers.length)],
      cost: Number(Math.floor(Math.random() * (template.costRange[1] - template.costRange[0]) + template.costRange[0])), // Ensure cost is a number
      notes: template.noteTemplates[Math.floor(Math.random() * template.noteTemplates.length)]
    };
    serviceHistory.push(service);
  }

  return serviceHistory.sort((a, b) => a.date.toMillis() - b.date.toMillis());
};

// Convert CSV examples into our gear format
const convertCSVToGear = (examples: CSVExample[]) => {
  return examples.map((example, index) => {
    // Generate random dates within the last 5 years
    const now = new Date();
    const fiveYearsAgo = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
    const acquiredDate = randomDate(fiveYearsAgo, now);
    
    // Randomly decide if the gear is sold (20% chance)
    const isSold = Math.random() < 0.2;
    const soldDate = isSold ? randomDate(acquiredDate, now) : null;
    const status = isSold ? GearStatus.Sold : GearStatus.Own;

    // Generate random price between 1500 and 4000
    const pricePaid = Math.floor(Math.random() * (4000 - 1500) + 1500);
    
    // Base gear object with required fields
    const baseGear = {
      make: example.manufacturer || '',
      model: example.model || '',
      type: GearType.Guitar,
      status,
      year: new Date(acquiredDate).getFullYear().toString(),
      dateAcquired: Timestamp.fromDate(acquiredDate),
      pricePaid,
      acquisitionNotes: 'Sample data from Axe Vault Specs database',
      specs: {
        overview: {
          manufacturer: example.manufacturer || '',
          model: example.model || '',
          bodySizeShape: example.bodySizeShape || '',
          series: example.series || '',
          buildType: example.buildType || '',
          topMaterial: example.topMaterial || '',
          bodyMaterial: example.bodyMaterial || '',
          scaleLength: example.scaleLength || '',
          nutWidth: example.nutWidth || '',
          neckShapeProfile: example.neckShapeProfile || '',
          neckTypeConstruction: example.neckTypeConstruction || '',
          pickupConfiguration: example.pickupConfiguration || '',
          countryOfOrigin: example.countryOfOrigin || '',
          serialNumber: example.serialNumber || `SAMPLE-${index + 1}`,
        }
      },
      serviceHistory: generateServiceHistory(index, acquiredDate)
    };

    // If the item is sold, add sale-related fields
    if (isSold && soldDate) {
      return {
        ...baseGear,
        dateSold: Timestamp.fromDate(soldDate),
        priceSold: Math.floor(pricePaid * (0.8 + Math.random() * 0.4)),
        saleNotes: 'Sample sale data'
      };
    }

    return baseGear;
  });
};

// Parse the CSV data into examples
const parseCSVData = (csvText: string): CSVExample[] => {
  const lines = csvText.split('\n');
  const examples: CSVExample[] = [];
  
  // Get the number of examples from the header
  const header = lines[0].split(',');
  const numExamples = header.filter(col => col.startsWith('Example')).length;
  
  // Create an example for each column
  for (let i = 1; i <= numExamples; i++) {
    const example: any = {};
    
    lines.forEach(line => {
      const columns = line.split(',');
      const category = columns[1]?.trim();
      const spec = columns[4]?.trim();
      
      if (category === 'Overview' && spec) {
        const value = columns[4 + i]?.trim() || '';
        const key = spec.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
        example[key] = value;
      }
    });
    
    if (Object.keys(example).length > 0) {
      examples.push(example as CSVExample);
    }
  }
  
  return examples;
};

export const loadCSVSampleData = async (csvPath: string) => {
  try {
    const response = await fetch(csvPath);
    const csvText = await response.text();
    const examples = parseCSVData(csvText);
    return convertCSVToGear(examples);
  } catch (error) {
    console.error('Error loading CSV sample data:', error);
    throw error;
  }
}; 
import { GearService } from '../services/gearService';
import { loadCSVSampleData } from './csvSampleData';

export const loadSampleData = async (userId: string) => {
  const gearService = new GearService();
  
  try {
    // Load sample data from CSV
    const sampleGear = await loadCSVSampleData('/Axe Vault Specs.csv');
    
    // Add sample gear without clearing existing gear
    await Promise.all(sampleGear.map(gear => gearService.addGear(userId, gear)));
  } catch (error) {
    console.error('Error loading sample data:', error);
    throw error;
  }
}; 
import { GearService } from './gearService';
import { BaseGear, HistoryRecord } from '../types/gear';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class GearGuruService {
  private genAI: GoogleGenerativeAI;
  private gearService: GearService;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY || '');
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    this.gearService = new GearService();
  }

  async chat(userId: string, message: string) {
    try {
      // Get user's gear collection
      const userGear = await this.gearService.getUserGear(userId);
      
      // Create context about the user's collection
      const context = this.createCollectionContext(userGear);
      
      // Generate chat prompt
      const prompt = `
        You are My Gear Guru, a helpful assistant for a musical gear collection management app.
        You have access to the following information about the user's gear collection:

        ${context}

        Important Instructions:
        1. Base your responses ONLY on the actual data provided above.
        2. When discussing dates, be specific (include the actual date).
        3. When discussing service history, reference the specific service records.
        4. If you don't have enough information to answer accurately, explain what information is missing.
        5. Be concise but thorough in your responses.
        6. If asked about maintenance or service history, always check the service records section.

        User Question: ${message}
      `;

      // Get response from Gemini
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error in GearGuru chat:', error);
      throw new Error('Failed to process your question. Please try again.');
    }
  }

  private createCollectionContext(gear: BaseGear[]): string {
    return `
      COLLECTION OVERVIEW
      Total Items: ${gear.length}
      Types: ${Array.from(new Set(gear.map(item => item.type))).join(', ')}
      
      DETAILED GEAR INVENTORY
      ${gear.map(item => `
        ITEM: ${item.make} ${item.model}
        - Type: ${item.type}
        - Status: ${item.status}
        - Make: ${item.make}
        - Model: ${item.model}
        - Acquired: ${item.dateAcquired ? new Date(item.dateAcquired).toLocaleDateString() : 'Unknown'}
        ${item.dateSold ? `- Sold: ${new Date(item.dateSold).toLocaleDateString()}` : ''}
        ${item.pricePaid ? `- Purchase Price: $${item.pricePaid}` : ''}
        ${item.priceSold ? `- Sale Price: $${item.priceSold}` : ''}
        
        SPECIFICATIONS
        ${Object.entries(item.specs || {}).map(([category, specs]) => `
          ${category.toUpperCase()}:
          ${Object.entries(specs as Record<string, any>).map(([key, value]) => `
            - ${key}: ${value}`).join('')}
        `).join('\n')}
        
        SERVICE HISTORY
        ${(item.serviceHistory || []).map((record: HistoryRecord) => `
          Date: ${new Date(record.date).toLocaleDateString()}
          Type: ${record.type}
          Provider: ${record.provider || 'Not specified'}
          Cost: ${record.cost ? `$${record.cost}` : 'Not specified'}
          Details: ${record.description}
          ${record.notes ? `Notes: ${record.notes}` : ''}
        `).join('\n')}
        
        NOTES
        ${item.acquisitionNotes ? `Acquisition Notes: ${item.acquisitionNotes}` : ''}
        ${item.saleNotes ? `Sale Notes: ${item.saleNotes}` : ''}
        
        -------------------
      `).join('\n')}
    `;
  }
} 
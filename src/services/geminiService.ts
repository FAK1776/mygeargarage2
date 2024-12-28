import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseGear, GearType, GuitarSpecs, ServiceRecord, OwnershipRecord, ModificationRecord } from '../types/gear';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY);

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  async parseGearSpecs(specs: string): Promise<Partial<BaseGear>> {
    const prompt = `
      Parse the following musical gear specifications and extract relevant information.
      Format the response as a JSON object with the following structure:
      {
        "type": "Guitar", // One of: Guitar, Bass, Microphone, Headphones, Speakers, Piano, Other
        "make": "", // Brand/manufacturer
        "model": "", // Model name
        "year": "", // Manufacturing year if available
        "modelNumber": "",
        "series": "",
        "serialNumber": "",
        "orientation": "", // Right Handed or Left Handed
        "numberOfStrings": "", // For guitars/basses
        "weight": "",
        "description": "",
        "label": "", // For commemorative or custom guitars
        "pleked": false, // Whether the guitar has been Plek processed
        "specs": {
          "body": {
            "shape": "",
            "size": "", // e.g., "D-14 Fret"
            "type": "",
            "material": "",
            "topBack": "",
            "finish": "",
            "depth": "",
            "binding": "",
            "bracing": {
              "pattern": "", // e.g., "X-Brace"
              "shape": ""  // e.g., "Scalloped"
            },
            "cutaway": "",
            "topColor": "",
            "rosette": {
              "type": "",
              "detail": "" // e.g., "Abalone with Multi-Stripe"
            },
            "endpiece": {
              "material": "",
              "inlay": "" // e.g., "Multi-Stripe"
            }
          },
          "neck": {
            "material": "",
            "shape": "",
            "thickness": "",
            "construction": "",
            "finish": "",
            "scaleLength": "",
            "heelcap": "", // Material or color
            "fingerboard": {
              "material": "",
              "radius": "",
              "widthAt12thFret": "", // e.g., "2 1/8''"
              "inlays": "",
              "binding": "",
              "sideDots": ""
            },
            "numberOfFrets": "",
            "fretSize": "",
            "nut": {
              "material": "",
              "width": ""
            }
          },
          "headstock": {
            "shape": "",
            "binding": "",
            "tuningMachines": "",
            "headplateLogo": ""
          },
          "hardware": {
            "bridge": "",
            "tailpiece": "",
            "finish": "",
            "pickguard": {
              "type": "",
              "inlay": "" // e.g., "None" or specific inlay pattern
            },
            "knobs": "",
            "strapButtons": ""
          },
          "electronics": {
            "pickupSystem": "",
            "neckPickup": "",
            "bridgePickup": "",
            "pickupConfiguration": "",
            "controls": "",
            "pickupSwitching": "",
            "auxiliarySwitching": ""
          },
          "extras": {
            "recommendedStrings": "", // e.g., "Authentic Acoustic Lifespan® 2.0 Phosphor Bronze - Medium"
            "strings": "",
            "caseOrGigBag": "",
            "modificationsRepairs": "",
            "uniqueFeatures": ""
          }
        }
      }

      IMPORTANT: Return ONLY the JSON object, with no additional text or formatting.
      Only include fields that are present in the specifications. Leave other fields as empty strings or false for boolean values.
      Here are the specifications to parse:

      ${specs}
    `;

    try {
      console.log('Sending prompt to Gemini:', prompt);
      const geminiResult = await this.model.generateContent(prompt);
      const response = await geminiResult.response;
      const text = response.text();
      console.log('Raw Gemini response:', text);
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON found in response:', text);
        throw new Error('Could not parse gear specifications');
      }

      console.log('Extracted JSON:', jsonMatch[0]);
      const parsedData = JSON.parse(jsonMatch[0]);

      // Convert the type string to GearType enum
      const gearType = Object.values(GearType).find(
        type => type.toLowerCase() === parsedData.type?.toLowerCase()
      ) || GearType.Other;

      // Ensure specs object has the correct structure
      const specs = {
        body: {
          shape: parsedData.specs?.body?.shape || '',
          type: parsedData.specs?.body?.type || '',
          material: parsedData.specs?.body?.material || '',
          topBack: parsedData.specs?.body?.topBack || '',
          finish: parsedData.specs?.body?.finish || '',
          depth: parsedData.specs?.body?.depth || '',
          binding: parsedData.specs?.body?.binding || '',
          bracing: parsedData.specs?.body?.bracing || '',
          cutaway: parsedData.specs?.body?.cutaway || '',
          topColor: parsedData.specs?.body?.topColor || ''
        },
        neck: {
          material: parsedData.specs?.neck?.material || '',
          shape: parsedData.specs?.neck?.shape || '',
          thickness: parsedData.specs?.neck?.thickness || '',
          construction: parsedData.specs?.neck?.construction || '',
          finish: parsedData.specs?.neck?.finish || '',
          scaleLength: parsedData.specs?.neck?.scaleLength || '',
          fingerboardMaterial: parsedData.specs?.neck?.fingerboard?.material || '',
          fingerboardRadius: parsedData.specs?.neck?.fingerboard?.radius || '',
          numberOfFrets: parsedData.specs?.neck?.numberOfFrets || '',
          fretSize: parsedData.specs?.neck?.fretSize || '',
          nutMaterial: parsedData.specs?.neck?.nut?.material || '',
          nutWidth: parsedData.specs?.neck?.nut?.width || '',
          fingerboardInlays: parsedData.specs?.neck?.fingerboard?.inlays || '',
          binding: parsedData.specs?.neck?.fingerboard?.binding || '',
          sideDots: parsedData.specs?.neck?.fingerboard?.sideDots || ''
        },
        headstock: {
          shape: parsedData.specs?.headstock?.shape || '',
          binding: parsedData.specs?.headstock?.binding || '',
          tuningMachines: parsedData.specs?.headstock?.tuningMachines || '',
          headplateLogo: parsedData.specs?.headstock?.headplateLogo || ''
        },
        hardware: {
          bridge: parsedData.specs?.hardware?.bridge || '',
          tailpiece: parsedData.specs?.hardware?.tailpiece || '',
          finish: parsedData.specs?.hardware?.finish || '',
          pickguard: parsedData.specs?.hardware?.pickguard?.type || '',
          knobs: parsedData.specs?.hardware?.knobs || '',
          strapButtons: parsedData.specs?.hardware?.strapButtons || ''
        },
        electronics: {
          pickupSystem: parsedData.specs?.electronics?.pickupSystem || '',
          neckPickup: parsedData.specs?.electronics?.neckPickup || '',
          bridgePickup: parsedData.specs?.electronics?.bridgePickup || '',
          pickupConfiguration: parsedData.specs?.electronics?.pickupConfiguration || '',
          controls: parsedData.specs?.electronics?.controls || '',
          pickupSwitching: parsedData.specs?.electronics?.pickupSwitching || '',
          auxiliarySwitching: parsedData.specs?.electronics?.auxiliarySwitching || ''
        },
        extras: {
          strings: parsedData.specs?.extras?.strings || '',
          caseOrGigBag: parsedData.specs?.extras?.caseOrGigBag || '',
          modificationsRepairs: parsedData.specs?.extras?.modificationsRepairs || '',
          uniqueFeatures: parsedData.specs?.extras?.uniqueFeatures || ''
        }
      };

      const finalResult = {
        type: gearType,
        make: parsedData.make || '',
        model: parsedData.model || '',
        year: parsedData.year || '',
        modelNumber: parsedData.modelNumber || '',
        series: parsedData.series || '',
        serialNumber: parsedData.serialNumber || '',
        orientation: parsedData.orientation || '',
        numberOfStrings: parsedData.numberOfStrings || '',
        weight: parsedData.weight || '',
        description: parsedData.description || '',
        specs
      };

      console.log('Final parsed result:', finalResult);
      return finalResult;
    } catch (error) {
      console.error('Error parsing gear specifications:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        });
      }
      throw new Error('Failed to parse gear specifications');
    }
  }

  async parseGearHistory(input: string, gear: BaseGear) {
    try {
      const today = new Date();
      today.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
      
      // Get current year and format today's date
      const currentYear = today.getFullYear();
      const todayFormatted = today.toISOString().split('T')[0];

      const prompt = `You are a musical gear expert. Parse the following text about a ${gear.type} (${gear.make} ${gear.model}) and extract information about service, maintenance, modifications, or ownership changes.

Return ONLY a JSON object (no markdown formatting, no code blocks) with this structure:
{
  "date": "extracted date in YYYY-MM-DD format. IMPORTANT RULES FOR DATES:
    - Today is ${todayFormatted}
    - For relative dates like 'last Monday', calculate the exact date relative to today (${todayFormatted})
    - For 'yesterday', use exactly one day before today
    - For specific dates like 'December 7th', use that exact date with ${currentYear}
    - For past dates like 'last week' or 'two days ago', calculate precisely from today
    - Default to today's date ONLY if no date is mentioned at all",
  "description": "detailed description of what was done",
  "provider": "service provider or person who did the work",
  "cost": number,
  "tags": ["array of applicable tags: service, modification, ownership"],
  "notes": "additional notes or context"
}

Examples of date handling:
1. "last Monday" = the most recent Monday before today
2. "yesterday" = exactly one day before today
3. "last week" = exactly 7 days before today
4. "two days ago" = exactly 2 days before today
5. "December 7th" = ${currentYear}-12-07

Guidelines for parsing:
1. For dates:
   - Calculate relative dates (like "last Monday") based on today (${todayFormatted})
   - Never change explicitly mentioned dates
   - Include leading zeros for single-digit months and days
   - Use noon (12:00) for all times to avoid timezone issues
2. For tags:
   - Use 'service' for maintenance, repairs, setups, adjustments
   - Use 'modification' for permanent changes, upgrades, replacements
   - Use 'ownership' for buying, selling, trading
3. For costs:
   - Extract any mentioned prices
   - Include only the numeric value

IMPORTANT: Return ONLY the JSON object, with no additional text or formatting.

Input text: "${input}"`;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Clean up the response text
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      
      try {
        // Parse the response into a record
        const record = JSON.parse(cleanText);
        
        // Convert date string to Date object
        if (record.date) {
          try {
            // Parse the date string and create a date object
            const [year, month, day] = record.date.split('-').map(Number);
            const date = new Date(year, month - 1, day, 12, 0, 0, 0); // Use noon to avoid timezone issues
            
            if (isNaN(date.getTime())) {
              record.date = today;
            } else {
              record.date = date;
            }
          } catch {
            record.date = today;
          }
        } else {
          record.date = today;
        }

        // Ensure tags array exists
        if (!record.tags || !Array.isArray(record.tags)) {
          record.tags = [];
        }

        // Normalize tags to lowercase
        record.tags = record.tags.map(tag => tag.toLowerCase());

        // Add timestamp-based ID
        record.id = Date.now().toString();

        return record;
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError, 'Clean Text:', cleanText);
        throw new Error('Failed to parse gear history. The response format was invalid.');
      }
    } catch (error) {
      console.error('Error parsing gear history:', error);
      throw new Error('Failed to parse gear history. Please try again with more specific information.');
    }
  }

  async queryCollection(query: string, gear: BaseGear[], wishlist: BaseGear[]) {
    try {
      const collectionContext = `
You are a knowledgeable and friendly guitar collection assistant. You should respond in a natural, conversational way while being precise about the details. Here's the current state of the collection:

Currently Owned Gear (${gear.filter(g => g.status === 'own').length} items):
${gear.filter(g => g.status === 'own').map(item => `- ${item.make} ${item.model} (${item.year || 'Year unknown'})
  * Type: ${item.type}
  * Body: ${item.specs?.body?.material ? `Made of ${item.specs.body.material}` : 'Material not specified'}
  * Neck: ${item.specs?.neck?.material ? `${item.specs.neck.material} neck` : 'Neck material not specified'}
  * Fingerboard: ${item.specs?.neck?.fingerboard?.material ? `${item.specs.neck.fingerboard.material} fingerboard` : 'Fingerboard material not specified'}
  * Finish: ${item.specs?.body?.finish || 'Not specified'}
  * Description: ${item.description || 'Not specified'}
  * Service History: ${(item.serviceHistory || []).map(record => 
      `\n    - ${new Date(record.date).toLocaleDateString()}: ${record.description}`
    ).join('')}
`).join('\n')}

Want List (${gear.filter(g => g.status === 'want').length} items):
${gear.filter(g => g.status === 'want').map(item => `- ${item.make} ${item.model} (${item.year || 'Year unknown'})
  * Type: ${item.type}
  * Body: ${item.specs?.body?.material ? `Made of ${item.specs.body.material}` : 'Material not specified'}
  * Neck: ${item.specs?.neck?.material ? `${item.specs.neck.material} neck` : 'Neck material not specified'}
  * Fingerboard: ${item.specs?.neck?.fingerboard?.material ? `${item.specs.neck.fingerboard.material} fingerboard` : 'Fingerboard material not specified'}
  * Finish: ${item.specs?.body?.finish || 'Not specified'}
  * Description: ${item.description || 'Not specified'}
`).join('\n')}

Previously Owned/Sold (${gear.filter(g => g.status === 'sold').length} items):
${gear.filter(g => g.status === 'sold').map(item => `- ${item.make} ${item.model} (${item.year || 'Year unknown'})
  * Type: ${item.type}
  * Body: ${item.specs?.body?.material ? `Made of ${item.specs.body.material}` : 'Material not specified'}
  * Neck: ${item.specs?.neck?.material ? `${item.specs.neck.material} neck` : 'Neck material not specified'}
  * Fingerboard: ${item.specs?.neck?.fingerboard?.material ? `${item.specs.neck.fingerboard.material} fingerboard` : 'Fingerboard material not specified'}
  * Finish: ${item.specs?.body?.finish || 'Not specified'}
  * Description: ${item.description || 'Not specified'}
`).join('\n')}

Instructions for responding:
1. Be conversational and friendly while maintaining accuracy
2. Always distinguish between currently owned instruments and those on the want list or previously sold
3. When answering questions about features or characteristics:
   - First mention what you find in the currently owned collection
   - Then mention any relevant items from the want list
   - Finally, mention any relevant previously owned items
4. For questions about modifications or service history, focus on currently owned instruments unless specifically asked about others
5. Use natural language and complete sentences
6. NEVER make assumptions about specifications that aren't explicitly listed
7. If a specification isn't listed, say "that information isn't specified" rather than guessing

For example, if asked "Do I have any black guitars?", respond like:
"No, you don't currently own any black guitars. However, I see that the Martin D-35 Johnny Cash model on your want list is black."

Question: ${query}`;

      const result = await this.model.generateContent(collectionContext);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Error querying collection:', error);
      throw new Error('Failed to analyze collection. Please try again.');
    }
  }
}

export const geminiService = new GeminiService(); 
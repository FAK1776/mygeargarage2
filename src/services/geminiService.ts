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
      const currentYear = new Date().getFullYear();
      const today = new Date();
      // Format today's date in local timezone
      const todayFormatted = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).split('/').reverse().join('-');

      const prompt = `You are a musical gear expert. Parse the following text about a ${gear.type} (${gear.make} ${gear.model}) and extract information about service, maintenance, modifications, or ownership changes.

Return ONLY a JSON object (no markdown formatting, no code blocks) with this structure:
{
  "date": "extracted date in YYYY-MM-DD format. IMPORTANT RULES FOR DATES:
    - For specific dates like 'December 7th', use EXACTLY that date with ${currentYear} as the year
    - Be precise with dates - December 7th must be '${currentYear}-12-07'
    - Never change or approximate the date mentioned
    - For relative dates: 'today' = ${todayFormatted}
    - For 'yesterday', subtract exactly one day from today
    - Default to today's date ONLY if no date is mentioned at all",
  "description": "detailed description of what was done",
  "provider": "service provider or person who did the work",
  "cost": number,
  "tags": ["array of applicable tags: service, modification, ownership"],
  "notes": "additional notes or context"
}

Guidelines for parsing:
1. For dates:
   - EXACT PRECISION IS REQUIRED
   - When someone says 'December 7th', the date MUST be '${currentYear}-12-07'
   - Never change the day number that was mentioned
   - Use the current year (${currentYear}) unless a specific year was mentioned
   - Include leading zeros for single-digit months and days
   - DO NOT adjust dates for timezones - use exactly the date mentioned
2. For tags:
   - Use 'service' for maintenance, repairs, setups, adjustments
   - Use 'modification' for permanent changes, upgrades, replacements
   - Use 'ownership' for buying, selling, trading
   - Multiple tags can apply (e.g., both 'service' and 'modification' for a setup that includes new parts)
3. For costs:
   - Extract any mentioned prices
   - Include only the numeric value

Example input: "I bought this on December 7th for $350"
Example output (no markdown, no code blocks):
{
  "date": "${currentYear}-12-07",
  "description": "Purchased guitar",
  "provider": null,
  "cost": 350,
  "tags": ["ownership"],
  "notes": "Initial purchase"
}

IMPORTANT: Return ONLY the JSON object, with no additional text or formatting.

Input text: "${input}"`;

      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Clean up the response text - remove any markdown formatting
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      
      try {
        // Parse the response into a record
        const record = JSON.parse(cleanText);
        
        // Convert date string to Date object, preserving the exact date
        if (record.date) {
          try {
            // Parse the date string and create a date object in local timezone
            const [year, month, day] = record.date.split('-').map(Number);
            record.date = new Date(year, month - 1, day, 12); // Use noon to avoid timezone issues
            
            if (isNaN(record.date.getTime())) {
              record.date = new Date(); // Fallback to current date if parsing fails
            }
          } catch {
            record.date = new Date(); // Fallback to current date if parsing fails
          }
        } else {
          record.date = new Date();
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
}

export const geminiService = new GeminiService(); 
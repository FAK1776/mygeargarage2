import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseGear, GearType, GearStatus, GuitarSpecs, ServiceRecord, OwnershipRecord, ModificationRecord } from '../types/gear';

export class GeminiService {
  private model;
  private PARSE_PROMPT = `You are a guitar specification parser. Convert the following guitar specifications into a structured format that exactly matches this schema:

1. OVERVIEW
- Manufacturer
- Model
- Body Size/Shape
- Series
- Build Type
- Top Material
- Body Material
- Scale Length
- Nut Width
- Neck Shape Profile
- Neck Type/Construction
- Pickup Configuration
- Country of Origin
- Serial Number

2. TOP
- Color
- Finish
- Binding
- Inlay Material
- Detail
- Bridge Style
- Rosette
- Bridge String Spacing
- Bridge Material
- Bridge Pin Material
- Bridge Pin Dots
- Saddle
- Saddle Radius

3. BODY
Design:
- Color (Back & Sides)
- Finish (Back & Sides)
- Binding
- Back Purfling
- Back Inlay Material
- Back Detail
- Side Detail
- Side Inlay Material
- Endpiece
- Endpiece Inlay
- Heelcap

Bracing:
- Body Bracing
- Bracing Pattern
- Brace Shape
- Brace Material
- Brace Size

Dimensions:
- Body Depth
- Upper Bout Width
- Upper Bout Depth
- Lower Bout Width
- Lower Bout Depth

4. NECK & HEADSTOCK
Neck:
- Taper
- Material
- Color
- Finish
- Binding
- Number of Frets
- Joins Body At
- Side Dots
- Truss Rod Type
- Nut Material

Fingerboard:
- Material
- Radius
- Width at 12th Fret
- Inlay Style
- Inlay Material
- Binding Material
- Rolled Edges
- Fret Size
- Fret Marker Style

Headstock:
- Shape
- Plate Material
- Logo Style
- Binding Material
- Detail

5. ELECTRONICS
- Acoustic Pickup
- Number of Pickups
- Bridge Pickup
- Middle Pickup
- Neck Pickup
- Pickup Color
- Controls
- Pickup Switching
- Output Type
- Special Electronics

6. HARDWARE
- Bridge
- Finish
- Tuning Machines
- Tuning Machine Knobs
- Tailpiece
- Pickguard
- Pickguard Inlay
- Control Knobs
- Switch Tip
- Neck Plate
- Strap Buttons

7. MISCELLANEOUS
- Pleked (true/false)
- Label
- Case
- Recommended Strings
- Weight
- Orientation
- Comments

Format your response as a JSON object with these exact field names and structure. Use empty strings for unknown values. For boolean fields, use false if unknown.

Input specifications:
{input_text}`;

  private HISTORY_PROMPT = `You are a gear history parser. Convert the following text about gear history into a structured format. Extract the following information:
1. date (infer from context if not explicit, default to today if unclear)
2. description (cleaned and standardized version of the input)
3. provider (if mentioned)
4. cost (if mentioned)
5. tags (array of relevant tags from: ownership, modification, maintenance, repairs)
6. notes (any additional details)

Format your response as a JSON object with these exact fields, using lowercase field names. Use empty strings for unknown text fields, 0 for unknown numbers, and empty arrays for unknown arrays.

Input text:
{input_text}`;

  private CHAT_PROMPT = `You are a helpful assistant for a musician's gear collection. You have access to their current gear collection, wishlist, and complete service/event history for each piece of gear. Help them by answering questions about their gear, maintenance history, modifications, and providing insights.

Current Collection:
{collection}

Gear History:
{history}

Wishlist:
{wishlist}

Please provide helpful, concise responses. When discussing history events, include dates when relevant. If you reference specific gear, use its exact make and model. If you make suggestions, explain your reasoning.

User Question: {input}`;

  constructor() {
    if (!import.meta.env.VITE_GOOGLE_AI_API_KEY) {
      console.error('Gemini API key is missing!');
      throw new Error('Gemini API key is required');
    }
    console.log('Initializing Gemini service with API key:', import.meta.env.VITE_GOOGLE_AI_API_KEY.substring(0, 4) + '...');
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY);
    this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  private cleanSpecificationText(text: string): string {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  private parseKeyValue(line: string): [string, string] {
    const parts = line.split(':');
    if (parts.length < 2) return ['', ''];
    
    const key = parts[0].trim();
    const value = parts.slice(1).join(':').trim();
    return [key, value];
  }

  private camelCase(str: string): string {
    return str.toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
  }

  private parseTableToSpecs(tableText: string): any {
    try {
      // Remove markdown code block syntax if present
      const cleanJson = tableText.replace(/^```json\n/, '').replace(/\n```$/, '');
      
      // Parse the JSON response
      const parsedData = JSON.parse(cleanJson);
      
      // Create the exact structure expected by the app
      return {
        type: "Guitar",
        make: parsedData.OVERVIEW?.Manufacturer || "",
        model: parsedData.OVERVIEW?.Model || "",
        specs: {
          overview: {
            manufacturer: parsedData.OVERVIEW?.Manufacturer || "",
            model: parsedData.OVERVIEW?.Model || "",
            bodySizeShape: parsedData.OVERVIEW?.["Body Size/Shape"] || "",
            series: parsedData.OVERVIEW?.Series || "",
            buildType: parsedData.OVERVIEW?.["Build Type"] || "",
            topMaterial: parsedData.OVERVIEW?.["Top Material"] || "",
            bodyMaterial: parsedData.OVERVIEW?.["Body Material"] || "",
            scaleLength: parsedData.OVERVIEW?.["Scale Length"] || "",
            nutWidth: parsedData.OVERVIEW?.["Nut Width"] || "",
            neckShapeProfile: parsedData.OVERVIEW?.["Neck Shape Profile"] || "",
            neckTypeConstruction: parsedData.OVERVIEW?.["Neck Type/Construction"] || "",
            pickupConfiguration: parsedData.OVERVIEW?.["Pickup Configuration"] || "",
            countryOfOrigin: parsedData.OVERVIEW?.["Country of Origin"] || "",
            serialNumber: parsedData.OVERVIEW?.["Serial Number"] || "",
          },
          top: {
            color: parsedData.TOP?.Color || "",
            finish: parsedData.TOP?.Finish || "",
            binding: parsedData.TOP?.Binding || "",
            inlayMaterial: parsedData.TOP?.["Inlay Material"] || "",
            detail: parsedData.TOP?.Detail || "",
            bridgeStyle: parsedData.TOP?.["Bridge Style"] || "",
            rosette: parsedData.TOP?.Rosette || "",
            bridgeStringSpacing: parsedData.TOP?.["Bridge String Spacing"] || "",
            bridgeMaterial: parsedData.TOP?.["Bridge Material"] || "",
            bridgePinMaterial: parsedData.TOP?.["Bridge Pin Material"] || "",
            bridgePinDots: parsedData.TOP?.["Bridge Pin Dots"] || "",
            saddle: parsedData.TOP?.Saddle || "",
            saddleRadius: parsedData.TOP?.["Saddle Radius"] || "",
          },
          body: {
            design: {
              color: parsedData.BODY?.Design?.["Color (Back & Sides)"] || "",
              finish: parsedData.BODY?.Design?.["Finish (Back & Sides)"] || "",
              binding: parsedData.BODY?.Design?.Binding || "",
              backPurfling: parsedData.BODY?.Design?.["Back Purfling"] || "",
              backInlayMaterial: parsedData.BODY?.Design?.["Back Inlay Material"] || "",
              backDetail: parsedData.BODY?.Design?.["Back Detail"] || "",
              sideDetail: parsedData.BODY?.Design?.["Side Detail"] || "",
              sideInlayMaterial: parsedData.BODY?.Design?.["Side Inlay Material"] || "",
              endpiece: parsedData.BODY?.Design?.Endpiece || "",
              endpieceInlay: parsedData.BODY?.Design?.["Endpiece Inlay"] || "",
              heelcap: parsedData.BODY?.Design?.Heelcap || "",
            },
            bracing: {
              bodyBracing: parsedData.BODY?.Bracing?.["Body Bracing"] || "",
              bracingPattern: parsedData.BODY?.Bracing?.["Bracing Pattern"] || "",
              braceShape: parsedData.BODY?.Bracing?.["Brace Shape"] || "",
              braceMaterial: parsedData.BODY?.Bracing?.["Brace Material"] || "",
              braceSize: parsedData.BODY?.Bracing?.["Brace Size"] || "",
            },
            dimensions: {
              bodyDepth: parsedData.BODY?.Dimensions?.["Body Depth"] || "",
              upperBoutWidth: parsedData.BODY?.Dimensions?.["Upper Bout Width"] || "",
              upperBoutDepth: parsedData.BODY?.Dimensions?.["Upper Bout Depth"] || "",
              lowerBoutWidth: parsedData.BODY?.Dimensions?.["Lower Bout Width"] || "",
              lowerBoutDepth: parsedData.BODY?.Dimensions?.["Lower Bout Depth"] || "",
            },
          },
          neckAndHeadstock: {
            neck: {
              taper: parsedData["NECK & HEADSTOCK"]?.Neck?.Taper || "",
              material: parsedData["NECK & HEADSTOCK"]?.Neck?.Material || "",
              color: parsedData["NECK & HEADSTOCK"]?.Neck?.Color || "",
              finish: parsedData["NECK & HEADSTOCK"]?.Neck?.Finish || "",
              binding: parsedData["NECK & HEADSTOCK"]?.Neck?.Binding || "",
              numberOfFrets: parsedData["NECK & HEADSTOCK"]?.Neck?.["Number of Frets"] || "",
              joinsBodyAt: parsedData["NECK & HEADSTOCK"]?.Neck?.["Joins Body At"] || "",
              sideDots: parsedData["NECK & HEADSTOCK"]?.Neck?.["Side Dots"] || "",
              trussRodType: parsedData["NECK & HEADSTOCK"]?.Neck?.["Truss Rod Type"] || "",
              nutMaterial: parsedData["NECK & HEADSTOCK"]?.Neck?.["Nut Material"] || "",
            },
            fingerboard: {
              material: parsedData["NECK & HEADSTOCK"]?.Fingerboard?.Material || "",
              radius: parsedData["NECK & HEADSTOCK"]?.Fingerboard?.Radius || "",
              widthAt12thFret: parsedData["NECK & HEADSTOCK"]?.Fingerboard?.["Width at 12th Fret"] || "",
              inlayStyle: parsedData["NECK & HEADSTOCK"]?.Fingerboard?.["Inlay Style"] || "",
              inlayMaterial: parsedData["NECK & HEADSTOCK"]?.Fingerboard?.["Inlay Material"] || "",
              bindingMaterial: parsedData["NECK & HEADSTOCK"]?.Fingerboard?.["Binding Material"] || "",
              rolledEdges: parsedData["NECK & HEADSTOCK"]?.Fingerboard?.["Rolled Edges"] || false,
              fretSize: parsedData["NECK & HEADSTOCK"]?.Fingerboard?.["Fret Size"] || "",
              fretMarkerStyle: parsedData["NECK & HEADSTOCK"]?.Fingerboard?.["Fret Marker Style"] || "",
            },
            headstock: {
              shape: parsedData["NECK & HEADSTOCK"]?.Headstock?.Shape || "",
              plateMaterial: parsedData["NECK & HEADSTOCK"]?.Headstock?.["Plate Material"] || "",
              logoStyle: parsedData["NECK & HEADSTOCK"]?.Headstock?.["Logo Style"] || "",
              bindingMaterial: parsedData["NECK & HEADSTOCK"]?.Headstock?.["Binding Material"] || "",
              detail: parsedData["NECK & HEADSTOCK"]?.Headstock?.Detail || "",
            },
          },
          electronics: {
            acousticPickup: parsedData.ELECTRONICS?.["Acoustic Pickup"] || "",
            numberOfPickups: parsedData.ELECTRONICS?.["Number of Pickups"] || "",
            bridgePickup: parsedData.ELECTRONICS?.["Bridge Pickup"] || "",
            middlePickup: parsedData.ELECTRONICS?.["Middle Pickup"] || "",
            neckPickup: parsedData.ELECTRONICS?.["Neck Pickup"] || "",
            pickupColor: parsedData.ELECTRONICS?.["Pickup Color"] || "",
            controls: parsedData.ELECTRONICS?.Controls || "",
            pickupSwitching: parsedData.ELECTRONICS?.["Pickup Switching"] || "",
            outputType: parsedData.ELECTRONICS?.["Output Type"] || "",
            specialElectronics: parsedData.ELECTRONICS?.["Special Electronics"] || "",
          },
          hardware: {
            bridge: parsedData.HARDWARE?.Bridge || "",
            finish: parsedData.HARDWARE?.Finish || "",
            tuningMachines: parsedData.HARDWARE?.["Tuning Machines"] || "",
            tuningMachineKnobs: parsedData.HARDWARE?.["Tuning Machine Knobs"] || "",
            tailpiece: parsedData.HARDWARE?.Tailpiece || "",
            pickguard: parsedData.HARDWARE?.Pickguard || "",
            pickguardInlay: parsedData.HARDWARE?.["Pickguard Inlay"] || "",
            controlKnobs: parsedData.HARDWARE?.["Control Knobs"] || "",
            switchTip: parsedData.HARDWARE?.["Switch Tip"] || "",
            neckPlate: parsedData.HARDWARE?.["Neck Plate"] || "",
            strapButtons: parsedData.HARDWARE?.["Strap Buttons"] || "",
          },
          miscellaneous: {
            pleked: parsedData.MISCELLANEOUS?.Pleked || false,
            label: parsedData.MISCELLANEOUS?.Label || "",
            case: parsedData.MISCELLANEOUS?.Case || "",
            recommendedStrings: parsedData.MISCELLANEOUS?.["Recommended Strings"] || "",
            weight: parsedData.MISCELLANEOUS?.Weight || "",
            orientation: parsedData.MISCELLANEOUS?.Orientation || "",
            comments: parsedData.MISCELLANEOUS?.Comments || "",
          },
        },
      };
    } catch (error) {
      console.error('Error parsing table specs:', error);
      throw new Error('Failed to parse specification table');
    }
  }

  async parseGearSpecs(text: string): Promise<any> {
    console.log('=== Starting parseGearSpecs ===');
    console.log('Input text:', text);

    const cleanedText = this.cleanSpecificationText(text);
    console.log('Cleaned text:', cleanedText);

    const prompt = `${this.PARSE_PROMPT}\n\n${cleanedText}`;
    console.log('Generated prompt:', prompt);

    try {
      console.log('Sending request to Gemini...');
      const result = await this.model.generateContent(prompt);
      console.log('Raw Gemini response:', result);

      const response = await result.response;
      console.log('Extracted response:', response);

      const tableText = response.text();
      console.log('Response text:', tableText);

      const specs = this.parseTableToSpecs(tableText);
      console.log('Final processed result:', specs);

      return specs;
    } catch (error) {
      console.error('Error in parseGearSpecs:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }
      throw new Error('Failed to process specifications. Please check the API key and try again.');
    }
  }

  async parseGearHistory(text: string, gear: BaseGear): Promise<any> {
    console.log('=== Starting parseGearHistory ===');
    console.log('Input text:', text);
    console.log('Gear context:', gear);

    try {
      const lowerText = text.toLowerCase();
      const yesterdayMatch = lowerText.includes('yesterday');
      const lastWeekMatch = lowerText.includes('last week');
      const costMatch = text.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
      const providerMatch = text.match(/(?:at|by|from|to)\s+([^.,]+)(?:[.,]|\s+(?:for|and))/i);
      const tags: string[] = [];

      if (lowerText.includes('mod') || lowerText.includes('modify') || lowerText.includes('upgrade')) {
        tags.push('modification');
      }
      if (lowerText.includes('bought') || lowerText.includes('sold') || lowerText.includes('purchase')) {
        tags.push('ownership');
      }
      
      // Determine date
      let date = new Date();
      if (yesterdayMatch) {
        date = new Date(Date.now() - 24 * 60 * 60 * 1000);
      } else if (lastWeekMatch) {
        date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      }
      
      // Format the prompt
      const prompt = this.HISTORY_PROMPT
        .replace('{input_text}', text)
        + `\n\nContext: This is about a ${gear.make} ${gear.model}.`;

      console.log('Generated prompt:', prompt);
      
      // Send to Gemini
      console.log('Sending request to Gemini...');
      const result = await this.model.generateContent(prompt);
      console.log('Raw Gemini response:', result);
      
      const response = await result.response;
      console.log('Extracted response:', response);
      
      const responseText = response.text();
      console.log('Response text:', responseText);
      
      // Parse the JSON response
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
      if (!jsonMatch) {
        throw new Error('Could not find JSON in response');
      }
      
      const parsedData = JSON.parse(jsonMatch[1]);
      console.log('Parsed data:', parsedData);
      
      // Clean up the cost value to ensure it's a number
      const cost = typeof parsedData.cost === 'string' 
        ? parseInt(parsedData.cost.replace(/[^0-9]/g, ''))
        : parsedData.cost || (costMatch ? parseInt(costMatch[1].replace(/[^0-9]/g, '')) : 0);
      
      // Return the structured data with the properly handled date
      return {
        date: date.toISOString(), // Always return as ISO string
        description: parsedData.description || text.trim(),
        provider: parsedData.provider || providerMatch?.[1]?.trim() || '',
        cost: cost,
        tags: parsedData.tags?.length > 0 ? parsedData.tags : ['maintenance'],
        notes: parsedData.notes || ''
      };
    } catch (error) {
      console.error('Error in parseGearHistory:', error);
      throw error;
    }
  }

  async queryCollection(input: string, collection: BaseGear[], wishlist: BaseGear[]): Promise<string> {
    console.log('=== Starting queryCollection ===');
    console.log('Input:', input);
    console.log('Collection:', collection);
    console.log('Wishlist:', wishlist);

    try {
      // Format the collection and wishlist for the prompt
      const collectionText = collection.map(gear => 
        `- ${gear.make} ${gear.model} (${gear.type})`
      ).join('\n');

      // Format the history for each piece of gear
      const historyText = collection.map(gear => {
        if (!gear.serviceHistory || gear.serviceHistory.length === 0) {
          return `${gear.make} ${gear.model}: No recorded history`;
        }

        const events = gear.serviceHistory
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Most recent first
          .map(event => {
            const date = new Date(event.date).toLocaleDateString();
            const cost = event.cost ? `($${event.cost})` : '';
            const provider = event.provider ? `at ${event.provider}` : '';
            const tags = event.tags?.length > 0 ? `[${event.tags.join(', ')}]` : '';
            return `  * ${date}: ${event.description} ${cost} ${provider} ${tags}`;
          })
          .join('\n');

        return `${gear.make} ${gear.model} History:\n${events}`;
      }).join('\n\n');

      const wishlistText = wishlist.map(gear => 
        `- ${gear.make} ${gear.model} (${gear.type})`
      ).join('\n');

      // Create the prompt
      const prompt = this.CHAT_PROMPT
        .replace('{collection}', collectionText || 'No items')
        .replace('{history}', historyText || 'No history records')
        .replace('{wishlist}', wishlistText || 'No items')
        .replace('{input}', input);

      console.log('Generated prompt:', prompt);

      // Send to Gemini
      console.log('Sending request to Gemini...');
      const result = await this.model.generateContent(prompt);
      console.log('Raw Gemini response:', result);

      const response = await result.response;
      console.log('Extracted response:', response);

      return response.text();
    } catch (error) {
      console.error('Error in queryCollection:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }
      throw new Error('Failed to process your question. Please try again.');
    }
  }

  private createCollectionContext(gear: BaseGear[]): string {
    const ownedGear = gear.filter(g => g.status === GearStatus.Own);
    const soldGear = gear.filter(g => g.status === GearStatus.Sold);
    const wishlistGear = gear.filter(g => g.status === GearStatus.Want);

    return `
      Collection Overview:
      - Total items: ${gear.length}
      - Currently owned: ${ownedGear.length}
      - Sold: ${soldGear.length}
      - Wishlist: ${wishlistGear.length}

      Currently Owned Items (${ownedGear.length} items):
      ${ownedGear.map(item => `- ${item.make} ${item.model} (${item.year || 'Year unknown'})`).join('\n')}

      ${soldGear.length > 0 ? `
      Previously Owned Items (${soldGear.length} items):
      ${soldGear.map(item => `- ${item.make} ${item.model} (${item.year || 'Year unknown'})`).join('\n')}
      ` : ''}

      ${wishlistGear.length > 0 ? `
      Wishlist Items (${wishlistGear.length} items):
      ${wishlistGear.map(item => `- ${item.make} ${item.model}`).join('\n')}
      ` : ''}

      Service History:
      ${gear.filter(g => g.status === GearStatus.Own).map(item => {
        if (!item.serviceHistory?.length) return '';
        return `
          ${item.make} ${item.model}:
          ${item.serviceHistory.map(record => `- ${new Date(record.date).toLocaleDateString()}: ${record.description}`).join('\n')}
        `;
      }).filter(Boolean).join('\n')}
    `;
  }
}

export const geminiService = new GeminiService(); 
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseGear, GearType, GuitarSpecs, ServiceRecord, OwnershipRecord, ModificationRecord } from '../types/gear';

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

  constructor() {
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

    const prompt = `${this.PARSE_PROMPT}

${cleanedText}`;
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
      throw error;
    }
  }
}

export const geminiService = new GeminiService(); 
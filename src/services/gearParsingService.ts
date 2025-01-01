import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { BaseGear, GearType, GuitarSpecs } from '../types/gear';

export class GearParsingService {
  private model;

  constructor() {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY);
    this.model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.1,
        topP: 1,
        topK: 1,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });
  }

  private validateGuitarSpecs(specs: any): specs is GuitarSpecs {
    try {
      // Check all required top-level sections exist
      const requiredSections = ['overview', 'top', 'body', 'neckAndHeadstock', 'electronics', 'hardware', 'miscellaneous'];
      if (!requiredSections.every(section => specs[section])) {
        return false;
      }

      // Check body subsections
      const bodySubsections = ['design', 'bracing', 'dimensions'];
      if (!bodySubsections.every(subsection => specs.body[subsection])) {
        return false;
      }

      // Check neckAndHeadstock subsections
      const neckSubsections = ['neck', 'fingerboard', 'headstock'];
      if (!neckSubsections.every(subsection => specs.neckAndHeadstock[subsection])) {
        return false;
      }

      // Verify pleked is boolean
      if (typeof specs.miscellaneous.pleked !== 'boolean') {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async parseGearSpecifications(rawText: string): Promise<Partial<BaseGear>> {
    try {
      const prompt = `You are a musical gear specification parser. Your task is to parse raw text specifications into a structured format.
      You will receive raw text containing gear specifications and must return a JSON object that exactly matches the following TypeScript interface.
      
      IMPORTANT: Your response must be ONLY the JSON object. Do not include any other text, explanations, or formatting.
      Do not use markdown. Do not wrap the JSON in backticks. Just return the raw JSON object.

      interface GuitarSpecs {
        overview: {
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
        };
        top: {
          color: string;
          finish: string;
          binding: string;
          inlayMaterial: string;
          detail: string;
          bridgeStyle: string;
          rosette: string;
          bridgeStringSpacing: string;
          bridgeMaterial: string;
          bridgePinMaterial: string;
          bridgePinDots: string;
          saddle: string;
          saddleRadius: string;
        };
        body: {
          design: {
            color: string;
            finish: string;
            binding: string;
            backPurfling: string;
            backInlayMaterial: string;
            backDetail: string;
            sideDetail: string;
            sideInlayMaterial: string;
            endpiece: string;
            endpieceInlay: string;
            heelcap: string;
          };
          bracing: {
            bodyBracing: string;
            bracingPattern: string;
            braceShape: string;
            braceMaterial: string;
            braceSize: string;
          };
          dimensions: {
            bodyDepth: string;
            upperBoutWidth: string;
            upperBoutDepth: string;
            lowerBoutWidth: string;
            lowerBoutDepth: string;
          };
        };
        neckAndHeadstock: {
          neck: {
            taper: string;
            material: string;
            color: string;
            finish: string;
            binding: string;
            numberOfFrets: string;
            joinsBodyAt: string;
            sideDots: string;
            trussRodType: string;
            nutMaterial: string;
          };
          fingerboard: {
            material: string;
            radius: string;
            widthAt12thFret: string;
            inlayStyle: string;
            inlayMaterial: string;
            bindingMaterial: string;
            rolledEdges: string;
            fretSize: string;
            fretMarkerStyle: string;
          };
          headstock: {
            shape: string;
            plateMaterial: string;
            logoStyle: string;
            bindingMaterial: string;
            detail: string;
          };
        };
        electronics: {
          acousticPickup: string;
          numberOfPickups: string;
          bridgePickup: string;
          middlePickup: string;
          neckPickup: string;
          pickupColor: string;
          controls: string;
          pickupSwitching: string;
          outputType: string;
          specialElectronics: string;
        };
        hardware: {
          bridge: string;
          finish: string;
          tuningMachines: string;
          tuningMachineKnobs: string;
          tailpiece: string;
          pickguard: string;
          pickguardInlay: string;
          controlKnobs: string;
          switchTip: string;
          neckPlate: string;
          strapButtons: string;
        };
        miscellaneous: {
          pleked: boolean;
          label: string;
          case: string;
          recommendedStrings: string;
          weight: string;
          orientation: string;
          comments: string;
        };
      }

      Important rules:
      1. Return ONLY valid JSON that matches this exact structure
      2. Use empty strings for unknown values
      3. Use false for unknown boolean values
      4. Do not add any fields not in this structure
      5. Do not omit any fields from this structure
      6. Maintain exact field names as shown
      7. Extract values exactly as they appear in the text
      8. Do not infer or guess values not present in the text
      9. If a value could map to multiple fields, use the most specific field
      10. For measurements, keep the units exactly as provided in the text
      11. Do not include any text before or after the JSON
      12. Do not use markdown formatting
      13. Do not wrap the JSON in backticks
      14. Use standard double quotes for JSON strings

      Here is the text to parse:
      ${rawText}`;

      console.log('Sending prompt to Gemini:', prompt);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      console.log('Raw Gemini response:', text);
      console.log('Response type:', typeof text);
      console.log('Response length:', text.length);
      console.log('First 100 characters:', text.substring(0, 100));
      console.log('Last 100 characters:', text.substring(text.length - 100));
      
      // Try to clean the response if needed
      let cleanedText = text
        .replace(/^```json\s*/, '') // Remove leading markdown
        .replace(/\s*```$/, '')     // Remove trailing markdown
        .trim();
      
      console.log('Cleaned response:', cleanedText);
      
      // Ensure the response is valid JSON
      let parsedSpecs;
      try {
        parsedSpecs = JSON.parse(cleanedText);
      } catch (error) {
        console.error('JSON parse error:', error);
        console.error('Failed text:', cleanedText);
        throw new Error('Failed to parse LLM response as JSON. Response was not in the correct format.');
      }

      // Validate the parsed specs match our expected structure
      if (!this.validateGuitarSpecs(parsedSpecs)) {
        throw new Error('Parsed specifications do not match the required structure.');
      }

      // Extract make and model from the overview section
      const { manufacturer, model } = parsedSpecs.overview;

      if (!manufacturer || !model) {
        throw new Error('Failed to extract manufacturer or model from specifications.');
      }

      return {
        type: GearType.Guitar,
        make: manufacturer,
        model: model,
        specs: parsedSpecs,
        metadata: {
          source: 'gemini',
          parseDate: new Date(),
          version: '2.0'
        }
      };
    } catch (error) {
      console.error('Error parsing gear specifications:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to parse specifications. Please check the format and try again.');
    }
  }
} 
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseGear, GearType, GuitarSpecs } from '../types/gear';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

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
        "specs": {
          "body": {
            "shape": "",
            "type": "",
            "material": "",
            "topBack": "",
            "finish": "",
            "depth": "",
            "binding": "",
            "bracing": "",
            "cutaway": "",
            "topColor": ""
          },
          "neck": {
            "material": "",
            "shape": "",
            "thickness": "",
            "construction": "",
            "finish": "",
            "scaleLength": "",
            "fingerboardMaterial": "",
            "fingerboardRadius": "",
            "numberOfFrets": "",
            "fretSize": "",
            "nutMaterial": "",
            "nutWidth": "",
            "fingerboardInlays": "",
            "binding": "",
            "sideDots": ""
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
            "pickguard": "",
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
            "strings": "",
            "caseOrGigBag": "",
            "modificationsRepairs": "",
            "uniqueFeatures": ""
          }
        }
      }

      Only include fields that are present in the specifications. Leave other fields as empty strings.
      Here are the specifications to parse:

      ${specs}
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not parse gear specifications');
      }

      const parsedData = JSON.parse(jsonMatch[0]);

      // Convert the type string to GearType enum
      const gearType = Object.values(GearType).find(
        type => type.toLowerCase() === parsedData.type?.toLowerCase()
      ) || GearType.Other;

      return {
        ...parsedData,
        type: gearType,
        specs: parsedData.specs as GuitarSpecs
      };
    } catch (error) {
      console.error('Error parsing gear specifications:', error);
      throw new Error('Failed to parse gear specifications');
    }
  }
}

export const geminiService = new GeminiService(); 
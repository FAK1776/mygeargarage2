import { GearType, BaseGear } from '../types/gear';

export class OpenAIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async parseGearSpecifications(
    rawText: string,
    gearType: GearType
  ): Promise<Partial<BaseGear>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a musical gear expert that specializes in extracting and structuring specifications from product descriptions. 
              For ${gearType} items, identify all relevant specifications and structure them consistently.
              Focus on technical specifications, measurements, materials, and components.
              Return the data in a structured JSON format that matches the following structure:
              {
                "name": "Full product name",
                "brand": "Manufacturer name",
                "model": "Model name/number",
                "category": "Main category",
                "subcategory": "Specific subcategory if applicable",
                "specs": {
                  // All technical specifications in a structured format
                  // Use consistent units (e.g., mm, inches)
                  // Group related specifications together
                }
              }`
            },
            {
              role: 'user',
              content: rawText
            }
          ],
          temperature: 0.3, // Lower temperature for more consistent output
          max_tokens: 2000
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to parse specifications');
      }

      // Parse the response content as JSON
      const parsedData = JSON.parse(data.choices[0].message.content);
      
      return {
        ...parsedData,
        type: gearType,
        rawData: rawText,
        metadata: {
          source: 'manual',
          parseDate: new Date(),
          version: 1
        }
      };
    } catch (error) {
      console.error('Error parsing gear specifications:', error);
      throw error;
    }
  }

  // Function to analyze and suggest gear type from raw text
  async suggestGearType(rawText: string): Promise<GearType> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a musical gear expert. Analyze the provided text and determine the type of gear being described.
              Respond with exactly one of the following types: guitar, bass, amplifier, pedal, microphone, interface, other.`
            },
            {
              role: 'user',
              content: rawText
            }
          ],
          temperature: 0.3
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to suggest gear type');
      }

      // Add null checks and validation
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from OpenAI');
      }

      const suggestedType = data.choices[0].message.content.toLowerCase().trim();
      
      // Validate that the suggested type is a valid GearType
      const validTypes = ['guitar', 'bass', 'amplifier', 'pedal', 'microphone', 'interface', 'other'];
      if (!validTypes.includes(suggestedType)) {
        throw new Error(`Invalid gear type suggested: ${suggestedType}`);
      }

      return suggestedType as GearType;
    } catch (error) {
      console.error('Error suggesting gear type:', error);
      // Default to 'other' if there's an error
      return GearType.Other;
    }
  }
} 
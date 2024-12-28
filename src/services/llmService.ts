import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export type StoryStyle = 'casual' | 'technical' | 'historical' | 'humorous' | 'poetic';

const STYLE_PROMPTS: Record<StoryStyle, string> = {
  casual: "Write in a friendly, conversational tone, focusing on the gear itself and what it suggests about the collection.",
  technical: "Focus on the technical specifications and details, discussing how they contribute to the overall sound and functionality.",
  historical: "Frame the story in terms of music history, relating the gear choices to different eras and genres.",
  humorous: "Add a light, humorous touch to the story, focusing on playful observations about the gear choices.",
  poetic: "Write with literary flair, using metaphors and vivid descriptions to paint a picture of the gear collection.",
};

export class LLMService {
  async generateGearStory(
    gearInfo: any,
    style: StoryStyle = 'casual',
    additionalContext: string = ''
  ): Promise<string> {
    const basePrompt = `
      As a knowledgeable music gear expert, write an engaging story about this gear collection.
      ${STYLE_PROMPTS[style]}

      Here's the collection:
      ${JSON.stringify(gearInfo, null, 2)}

      Important guidelines:
      - Focus only on what the gear collection itself reveals
      - Do not make assumptions about the owner's age, background, or history
      - Do not invent or assume dates or timelines unless explicitly provided
      - Analyze the collection based on the actual data provided
      - Discuss the gear choices, combinations, and what they suggest about musical interests
      - Consider the current state of the collection (owned vs wanted vs sold items)

      ${additionalContext}

      Write the story in an engaging style. Include specific details about the gear
      but keep the tone appropriate to the selected style. Aim for about 3-4 paragraphs.
    `;

    try {
      const result = await model.generateContent(basePrompt);
      const text = result.response.text();
      return text;
    } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('Failed to generate story. Please try again.');
    }
  }

  async generateGearInsights(gearInfo: any): Promise<string> {
    const prompt = `
      Analyze this gear collection and provide interesting insights:
      ${JSON.stringify(gearInfo, null, 2)}

      Consider:
      - Brand preferences and patterns
      - Investment in different types of gear
      - Evolution of the collection
      - Potential future directions
      - Notable combinations or setups

      Provide 3-5 clear insights. For each insight:
      1. Start with a clear, descriptive heading in square brackets
      2. Follow with a detailed explanation
      3. Do not use any markdown formatting (no asterisks, underscores, etc.)
      
      Example format:
      [Brand Diversity]
      The collection shows a preference for multiple major guitar manufacturers...

      [Collection Evolution]
      The mix of owned and wanted items indicates...

      Keep the tone analytical and factual, avoiding any assumptions about the owner.
    `;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return text;
    } catch (error) {
      console.error('Error generating insights:', error);
      throw new Error('Failed to generate insights. Please try again.');
    }
  }
} 
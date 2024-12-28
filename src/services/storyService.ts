import { BaseGear } from '../types/gear';
import { LLMService, StoryStyle } from './llmService';
import { db } from '../config/firebase';
import { doc, setDoc, getDoc, collection } from 'firebase/firestore';

export interface SavedStory {
  id: string;
  content: string;
  style: StoryStyle;
  createdAt: Date;
  insights?: string;
}

export class StoryService {
  private llmService: LLMService;

  constructor() {
    this.llmService = new LLMService();
  }

  private formatGearForPrompt(gear: BaseGear[]) {
    return gear.map(item => ({
      make: item.make,
      model: item.model,
      status: item.status,
      dateAcquired: item.dateAcquired,
      type: item.type,
    }));
  }

  async generateStory(gear: BaseGear[], style: StoryStyle = 'casual'): Promise<string> {
    const formattedGear = this.formatGearForPrompt(gear);
    return this.llmService.generateGearStory(formattedGear, style);
  }

  async generateInsights(gear: BaseGear[]): Promise<string> {
    const formattedGear = this.formatGearForPrompt(gear);
    return this.llmService.generateGearInsights(formattedGear);
  }

  async saveStory(userId: string, story: string, style: StoryStyle, insights?: string): Promise<string> {
    const storyDoc = {
      content: story,
      style,
      createdAt: new Date(),
      insights,
    };

    const storiesRef = collection(db, 'users', userId, 'stories');
    const docRef = doc(storiesRef);
    await setDoc(docRef, storyDoc);
    
    return docRef.id;
  }

  async getStory(userId: string, storyId: string): Promise<SavedStory | null> {
    const storyRef = doc(db, 'users', userId, 'stories', storyId);
    const storySnap = await getDoc(storyRef);
    
    if (!storySnap.exists()) {
      return null;
    }

    const data = storySnap.data();
    return {
      id: storyId,
      content: data.content,
      style: data.style,
      createdAt: data.createdAt.toDate(),
      insights: data.insights,
    };
  }
} 
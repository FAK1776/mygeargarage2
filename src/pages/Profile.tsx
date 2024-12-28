import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { GearService } from '../services/gearService';
import { StoryService, SavedStory } from '../services/storyService';
import { BaseGear, GearStatus } from '../types/gear';
import { StoryStyle } from './llmService';

export const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState<string | null>(null);
  const [insights, setInsights] = useState<string | null>(null);
  const [gear, setGear] = useState<BaseGear[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<StoryStyle>('casual');
  const [savedStories, setSavedStories] = useState<SavedStory[]>([]);
  const gearService = new GearService();
  const storyService = new StoryService();

  // Stats
  const stats = {
    total: gear.length,
    owned: gear.filter(g => g.status === GearStatus.Own).length,
    wanted: gear.filter(g => g.status === GearStatus.Want).length,
    sold: gear.filter(g => g.status === GearStatus.Sold).length,
    byType: Object.groupBy(gear, g => g.type),
    byBrand: Object.groupBy(gear, g => g.make),
  };

  useEffect(() => {
    if (!user) return;

    const loadGear = async () => {
      try {
        const userGear = await gearService.getUserGear(user.uid);
        setGear(userGear);
      } catch (error) {
        console.error('Error loading gear:', error);
      }
    };

    loadGear();
  }, [user]);

  const generateStory = async () => {
    if (!user || gear.length === 0) return;
    
    setLoading(true);
    try {
      const [generatedStory, generatedInsights] = await Promise.all([
        storyService.generateStory(gear, selectedStyle),
        storyService.generateInsights(gear)
      ]);
      
      setStory(generatedStory);
      setInsights(generatedInsights);
      
      // Auto-save the story
      if (user) {
        await storyService.saveStory(user.uid, generatedStory, selectedStyle, generatedInsights);
      }
    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-28 pb-8 max-w-7xl">
      <div className="flex flex-col gap-8">
        {/* Profile Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-light text-gray-900">My Profile</h1>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-800">Collection Overview</h3>
            <div className="mt-4 space-y-2">
              <p>Total Gear: {stats.total}</p>
              <p>Currently Own: {stats.owned}</p>
              <p>Want List: {stats.wanted}</p>
              <p>Sold: {stats.sold}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-800">Gear by Type</h3>
            <div className="mt-4 space-y-2">
              {Object.entries(stats.byType).map(([type, items]) => (
                <p key={type}>{type}: {items.length}</p>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-800">Top Brands</h3>
            <div className="mt-4 space-y-2">
              {Object.entries(stats.byBrand)
                .sort(([,a], [,b]) => b.length - a.length)
                .slice(0, 5)
                .map(([brand, items]) => (
                  <p key={brand}>{brand}: {items.length}</p>
                ))
              }
            </div>
          </div>
        </div>

        {/* My Gear Story Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-medium text-gray-800">My Gear Story</h2>
              <p className="text-gray-600 mt-1">
                Generate a unique story about your gear collection and musical journey.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value as StoryStyle)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="casual">Casual</option>
                <option value="technical">Technical</option>
                <option value="historical">Historical</option>
                <option value="humorous">Humorous</option>
                <option value="poetic">Poetic</option>
              </select>
              <button
                onClick={generateStory}
                disabled={loading || gear.length === 0}
                className="px-4 py-2 bg-[#EE5430] text-white rounded hover:bg-[#EE5430]/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Story'}
              </button>
            </div>
          </div>

          <div className="prose max-w-none">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EE5430]"></div>
              </div>
            ) : story ? (
              <div className="space-y-6">
                <div className="whitespace-pre-wrap">{story}</div>
                {insights && (
                  <div className="mt-8 border-t pt-6">
                    <h3 className="text-xl font-medium text-gray-800 mb-4">Collection Insights</h3>
                    <div className="space-y-6">
                      {insights.split('\n\n').map((section, index) => {
                        const [heading, ...content] = section.split('\n');
                        if (!heading || !content.length) return null;
                        
                        return (
                          <div key={index} className="space-y-2">
                            <h4 className="text-lg font-medium text-gray-700">
                              {heading.replace(/[\[\]]/g, '')}
                            </h4>
                            <p className="text-gray-600">
                              {content.join('\n')}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : gear.length === 0 ? (
              <p className="text-gray-500 text-center py-12">
                Add some gear to your collection to generate your gear story!
              </p>
            ) : (
              <p className="text-gray-500 text-center py-12">
                Click "Generate Story" to create your personalized gear story.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 
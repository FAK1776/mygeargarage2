import React from 'react';
import { BaseGear } from '../../types/gear';

interface TimelineItemContent {
  title: string;
  content: React.ReactNode;
}

interface TimelineProps {
  data: TimelineItemContent[];
}

export const Timeline: React.FC<TimelineProps> = ({ data }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="relative">
        {/* Timeline items */}
        <div className="space-y-24">
          {data.map((item, idx) => (
            <div key={idx} className="relative">
              {/* Year marker with line running through it */}
              <div className="relative">
                {/* Vertical line that runs through everything */}
                <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-neutral-200" 
                     style={{ height: idx === data.length - 1 ? '100%' : '150%', zIndex: 0 }} />
                
                {/* Year number */}
                <div className="relative z-10">
                  <span className="absolute left-0 text-6xl font-bold text-neutral-800" style={{ top: '-0.5em' }}>
                    {item.title}
                  </span>
                </div>

                {/* Content */}
                <div className="ml-44 pt-16">
                  <div className="relative">
                    {/* Content area */}
                    <div className="pb-8">
                      {item.content}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 
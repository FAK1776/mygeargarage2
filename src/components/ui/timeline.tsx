import React from 'react';

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
        <div className="space-y-24">
          {data.map((item, idx) => (
            <div key={idx} className="relative">
              <div className="relative">
                {/* Vertical line */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-600" 
                  style={{ height: idx === data.length - 1 ? '100%' : '150%', zIndex: 0 }} 
                />
                
                {/* Timeline dot */}
                <div className="absolute -left-[5px] top-8 w-3.5 h-3.5 rounded-full bg-white border-4 border-indigo-600 z-10" />

                {/* Content */}
                <div className="flex">
                  {/* Line and content container */}
                  <div className="pl-8 flex-grow">
                    <div className="relative pb-8">
                      {item.content}
                    </div>
                  </div>

                  {/* Year number */}
                  <div className="w-48 pl-8">
                    <h2 className="text-7xl font-bold text-gray-200 sticky top-32">
                      {item.title}
                    </h2>
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
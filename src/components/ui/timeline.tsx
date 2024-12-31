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
        <div className="space-y-12 md:space-y-24">
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
                <div className="flex flex-col md:flex-row">
                  {/* Line and content container */}
                  <div className="pl-8 flex-grow order-2 md:order-1">
                    <div className="relative pb-8">
                      {item.content}
                    </div>
                  </div>

                  {/* Year number */}
                  <div className="w-full md:w-48 pl-8 mb-4 md:mb-0 order-1 md:order-2">
                    <h2 className="text-4xl md:text-7xl font-bold text-gray-400 md:sticky md:top-32">
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
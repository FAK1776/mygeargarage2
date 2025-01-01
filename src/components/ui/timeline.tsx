import React from 'react';

export interface TimelineEvent {
  date: Date;
  type: string;
  gear: any;
  description: string;
  provider?: string;
  price?: number;
}

export interface TimelineProps {
  events: TimelineEvent[];
  formatContent: (event: TimelineEvent) => React.ReactNode;
}

export const Timeline: React.FC<TimelineProps> = ({ events, formatContent }) => {
  // Group events by year
  const groupedEvents = events.reduce((acc, event) => {
    const year = new Date(event.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(event);
    return acc;
  }, {} as Record<number, TimelineEvent[]>);

  // Sort years in descending order
  const sortedYears = Object.keys(groupedEvents)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="space-y-8">
      {sortedYears.map(year => (
        <div key={year} className="relative">
          <div className="sticky top-0 bg-white z-10 py-2">
            <h2 className="text-2xl font-bold text-gray-900">{year}</h2>
          </div>
          <div className="space-y-4 mt-4">
            {groupedEvents[year].map((event, index) => (
              <div key={index} className="relative">
                <div className="ml-4">
                  <div className="absolute left-0 top-4 -ml-2 h-4 w-4 rounded-full bg-[#EE5430]" />
                  <div className="border-l-2 border-gray-200 pl-6 pb-4">
                    <div className="text-sm text-gray-500 mb-2">
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    {formatContent(event)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}; 
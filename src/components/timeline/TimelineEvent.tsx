import React from 'react';
import { FaShoppingCart, FaHandshake, FaTools, FaWrench } from 'react-icons/fa';

interface TimelineEventProps {
  event: {
    date: Date;
    type: string;
    gear: any;
    description: string;
    provider?: string;
    price?: string;
    image?: string;
  };
}

export const TimelineEvent: React.FC<TimelineEventProps> = ({ event }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const getEventDescription = (event) => {
    switch (event.type) {
      case 'repairs':
        return `Repair: ${event.description}${event.provider ? ` at ${event.provider}` : ''}`;
      case 'maintenance':
        return `Maintenance: ${event.description}${event.provider ? ` at ${event.provider}` : ''}`;
      case 'modification':
        return `Modification: ${event.description}${event.provider ? ` by ${event.provider}` : ''}`;
      case 'ownership':
        if (event.description.toLowerCase().includes('sold')) {
          return `Sold${event.provider ? ` to ${event.provider}` : ''}`;
        }
        return `Acquired${event.provider ? ` from ${event.provider}` : ''}`;
      default:
        return event.description;
    }
  };

  return (
    <div className="flex items-start gap-4 mb-8">
      <div className="relative flex items-center">
        <div className="h-4 w-4 rounded-full bg-white border-2 border-indigo-600"></div>
        <div className="absolute h-full w-0.5 bg-indigo-600 top-4 -z-10"></div>
      </div>
      <div className="flex-1">
        <div className="flex items-baseline gap-3">
          <span className="text-sm font-medium text-gray-600">{formatDate(event.date)}</span>
          <h3 className="text-xl font-medium text-gray-900">{event.gear.make} {event.gear.model}</h3>
        </div>
        <p className="mt-1 text-base text-gray-700">{getEventDescription(event)}</p>
      </div>
    </div>
  );
}; 
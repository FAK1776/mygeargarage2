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
  const getEventIcon = () => {
    switch (event.type) {
      case 'purchase':
        return <FaShoppingCart className="w-5 h-5 text-green-600" />;
      case 'sale':
        return <FaHandshake className="w-5 h-5 text-blue-600" />;
      case 'service':
        return <FaTools className="w-5 h-5 text-orange-600" />;
      case 'maintenance':
        return <FaWrench className="w-5 h-5 text-purple-600" />;
      default:
        return null;
    }
  };

  const shouldShowImage = event.type === 'purchase' || event.type === 'sale';

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-shrink-0">
          {getEventIcon()}
        </div>
        <p className="text-sm text-gray-500">
          {new Date(event.date).toLocaleDateString()}
        </p>
        {event.price && (
          <div className="text-sm font-medium text-gray-900">
            {event.price}
          </div>
        )}
      </div>
      
      <div className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {event.gear.make} {event.gear.model}
        </h3>
        <p className="mb-2">{event.description}</p>
        {event.provider && (
          <p className="text-sm text-gray-500 mb-4">
            Provider: {event.provider}
          </p>
        )}
      </div>

      {shouldShowImage && event.image && (
        <div className="mt-4">
          <img
            src={event.image}
            alt={`${event.gear.make} ${event.gear.model}`}
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
          />
        </div>
      )}
    </div>
  );
}; 
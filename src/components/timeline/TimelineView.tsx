import React, { useState, useMemo } from 'react';
import { BaseGear, HistoryRecordType } from '../../types/gear';
import { Timeline, TimelineEvent as UITimelineEvent } from '../ui/timeline';
import { GearDetailsOverlay } from '../gear/GearDetailsOverlay';
import { Input } from '../ui/input';
import { GearService } from '../../services/gearService';
import { useAuth } from '../../hooks/useAuth';

interface TimelineViewProps {
  gear: BaseGear[];
  onUpdate: (updatedGear: BaseGear) => void;
}

interface TimelineEvent {
  date: Date;
  type: HistoryRecordType;
  gear: BaseGear;
  description: string;
  provider?: string;
  price?: number;
}

interface GearImage {
  url: string;
  path: string;
  timestamp: number;
}

const eventTypes = ['All', 'Ownership', 'Modification', 'Maintenance', 'Repairs'] as const;
type EventType = typeof eventTypes[number];

const eventColors = {
  ownership: { bg: 'bg-blue-100', text: 'text-blue-800', selected: 'bg-blue-500' },
  maintenance: { bg: 'bg-green-100', text: 'text-green-800', selected: 'bg-green-500' },
  modification: { bg: 'bg-purple-100', text: 'text-purple-800', selected: 'bg-purple-500' },
  repairs: { bg: 'bg-orange-100', text: 'text-orange-800', selected: 'bg-orange-500' },
} as const;

const getEventColors = (type: string) => {
  const key = type.toLowerCase() as keyof typeof eventColors;
  return eventColors[key] || { bg: 'bg-gray-100', text: 'text-gray-800', selected: 'bg-gray-500' };
};

const getDateFromField = (date: Date | string): Date => {
  if (!date) return new Date();
  if (typeof date === 'string') {
    return new Date(date);
  }
  return date;
};

const standardizeManufacturer = (name: string): string => {
  if (name.includes('C.F. Martin & Co.')) return 'Martin';
  // Add more manufacturer standardizations here
  return name;
};

const getEventType = (type: string): HistoryRecordType => {
  switch (type.toLowerCase()) {
    case 'purchase':
    case 'bought':
    case 'sale':
    case 'sold':
      return 'ownership';
    case 'repair':
    case 'repairs':
      return 'repairs';
    case 'modification':
    case 'mod':
      return 'modification';
    case 'maintenance':
    case 'service':
    case 'setup':
      return 'maintenance';
    default:
      return 'maintenance';
  }
};

export const TimelineView: React.FC<TimelineViewProps> = ({ gear, onUpdate }) => {
  const [selectedType, setSelectedType] = useState<EventType>('All');
  const [selectedGear, setSelectedGear] = useState<BaseGear | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstrument, setSelectedInstrument] = useState<string>('All');
  const { user } = useAuth();
  const gearService = new GearService();

  // Create list of unique instruments for the filter dropdown
  const instruments = useMemo(() => {
    const uniqueInstruments = new Set(gear.map(item => {
      const standardizedMake = standardizeManufacturer(item.make);
      return `${standardizedMake} ${item.model}`;
    }));
    return ['All', ...Array.from(uniqueInstruments)];
  }, [gear]);

  const events = useMemo(() => {
    const events: TimelineEvent[] = [];

    gear.forEach(item => {
      const standardizedMake = standardizeManufacturer(item.make);
      
      // Add purchase event
      if (item.dateAcquired) {
        events.push({
          date: getDateFromField(item.dateAcquired),
          type: 'ownership',
          gear: { ...item, make: standardizedMake },
          description: `Purchased ${standardizedMake} ${item.model}`,
          price: item.pricePaid
        });
      }

      // Add sale event
      if (item.dateSold) {
        events.push({
          date: getDateFromField(item.dateSold),
          type: 'ownership',
          gear: { ...item, make: standardizedMake },
          description: `Sold to ${item.soldTo || 'unknown'}`,
          price: item.priceSold
        });
      }

      // Add service and maintenance events
      if (item.serviceHistory) {
        item.serviceHistory.forEach(service => {
          if (service.date && service.description) {
            // Use the first tag as the event type, falling back to the type field
            const eventType = service.tags?.[0] || service.type || 'maintenance';
            events.push({
              date: getDateFromField(service.date),
              type: eventType as HistoryRecordType,
              gear: { ...item, make: standardizedMake },
              description: service.description,
              provider: service.provider,
              price: service.cost
            });
          }
        });
      }
    });

    let filteredEvents = events;

    // Filter by event type
    if (selectedType !== 'All') {
      filteredEvents = filteredEvents.filter(event => 
        event.type.toLowerCase() === selectedType.toLowerCase()
      );
    }

    // Filter by instrument
    if (selectedInstrument !== 'All') {
      filteredEvents = filteredEvents.filter(event => {
        const gearName = `${event.gear.make} ${event.gear.model}`;
        return gearName === selectedInstrument;
      });
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredEvents = filteredEvents.filter(event => 
        event.description.toLowerCase().includes(query) ||
        event.provider?.toLowerCase().includes(query) ||
        `${event.gear.make} ${event.gear.model}`.toLowerCase().includes(query)
      );
    }

    return filteredEvents.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [gear, selectedType, selectedInstrument, searchQuery]);

  const handleGearClick = (gear: BaseGear) => {
    setSelectedGear(gear);
  };

  const handleGearUpdate = async (updatedGear: BaseGear) => {
    if (!user) return;
    try {
      await gearService.updateGear(user.uid, updatedGear.id, updatedGear);
      // Update the gear in the timeline view's parent component
      onUpdate(updatedGear);
      // Update local state
      setSelectedGear(updatedGear);
    } catch (error) {
      console.error('Error updating gear:', error);
    }
  };

  const formatEventContent = (event: TimelineEvent) => {
    const { type, gear, description, provider, price } = event;
    const isOwnershipEvent = type === 'ownership';
    const mainImage = gear.images?.[0] as (GearImage | string | undefined);
    const imageUrl = typeof mainImage === 'string' ? mainImage : mainImage?.url;
    const colors = getEventColors(type);

    return (
      <div 
        className="p-4 bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => handleGearClick(gear)}
      >
        <div className="flex items-start gap-4">
          {isOwnershipEvent && imageUrl && (
            <img 
              src={imageUrl} 
              alt={`${gear.make} ${gear.model}`} 
              className="w-24 h-24 object-cover rounded"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-medium">
                {gear.make} {gear.model}
              </h3>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors.bg} ${colors.text}`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            </div>
            <p className="text-gray-600 mb-2">{description}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
              {provider && <p>Provider: {provider}</p>}
              {price && <p>Cost: ${price.toFixed(2)}</p>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const timelineEvents: UITimelineEvent[] = events.map(event => ({
    ...event,
    type: event.type.toString()
  }));

  const formatUIEventContent = (event: UITimelineEvent) => {
    return formatEventContent(event as unknown as TimelineEvent);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex flex-col gap-1">
          <label htmlFor="instrument-filter" className="text-sm text-gray-600">
            Filter by Instrument
          </label>
          <select
            id="instrument-filter"
            value={selectedInstrument}
            onChange={(e) => setSelectedInstrument(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#EE5430] focus:border-transparent"
          >
            {instruments.map(instrument => (
              <option key={instrument} value={instrument}>
                {instrument}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {eventTypes.map(type => {
          const colors = type === 'All' ? null : getEventColors(type);
          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedType === type
                  ? type === 'All'
                    ? 'bg-[#EE5430] text-white'
                    : `${colors?.selected} text-white`
                  : type === 'All'
                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    : `${colors?.bg} ${colors?.text} hover:bg-opacity-80`
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>

      <Timeline events={timelineEvents} formatContent={formatUIEventContent} />

      {selectedGear && (
        <GearDetailsOverlay
          gear={selectedGear}
          onClose={() => setSelectedGear(null)}
          isOpen={true}
          onUpdate={handleGearUpdate}
        />
      )}
    </div>
  );
}; 
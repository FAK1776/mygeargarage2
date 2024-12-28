import React, { useState, useMemo } from 'react';
import { BaseGear } from '../../types/gear';
import { Timeline } from '../ui/timeline';
import { FaFilter } from 'react-icons/fa';

interface TimelineViewProps {
  gear: BaseGear[];
}

type EventType = 'purchase' | 'sale' | 'service' | 'maintenance';

const getDateFromField = (field: any): Date => {
  if (!field) return new Date();
  // Handle Firestore Timestamp
  if (field.toDate && typeof field.toDate === 'function') {
    return field.toDate();
  }
  // Handle string dates
  if (typeof field === 'string') {
    return new Date(field);
  }
  // Handle Date objects
  if (field instanceof Date) {
    return field;
  }
  // Default fallback
  return new Date(field);
};

const getAllEvents = (gear: BaseGear[]) => {
  return gear.flatMap(item => {
    const events = [];
    
    // Add purchase event
    if (item.dateAcquired) {
      events.push({
        date: getDateFromField(item.dateAcquired),
        type: 'purchase',
        gear: item,
        description: 'Purchased',
        provider: item.acquisitionNotes,
        price: item.pricePaid
      });
    }

    // Add sale event
    if (item.dateSold) {
      events.push({
        date: getDateFromField(item.dateSold),
        type: 'sale',
        gear: item,
        description: 'Sold',
        provider: item.saleNotes,
        price: item.priceSold
      });
    }

    // Add service and maintenance events
    if (item.serviceHistory) {
      item.serviceHistory.forEach(service => {
        events.push({
          date: getDateFromField(service.date),
          type: service.type,
          gear: item,
          description: service.description,
          provider: service.provider,
          price: service.cost
        });
      });
    }

    return events;
  });
};

const formatEventContent = (event: any) => {
  const date = new Date(event.date).toLocaleDateString();
  const isPurchaseOrSale = event.type === 'purchase' || event.type === 'sale';
  const mainImage = event.gear.images?.[0];
  
  return (
    <div className="mb-6">
      <div className="flex items-start gap-4">
        {isPurchaseOrSale && mainImage && (
          <img 
            src={mainImage} 
            alt={`${event.gear.make} ${event.gear.model}`}
            className="w-24 h-24 object-cover rounded-lg"
          />
        )}
        <div>
          <p className="text-gray-900 text-base md:text-lg font-medium mb-2">
            {date} - {event.gear.make} {event.gear.model}
          </p>
          <div className="text-gray-800 text-sm md:text-base">
            {event.description}
            {event.provider && ` at ${event.provider}`}
            {event.price && ` - ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(event.price)}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export const TimelineView: React.FC<TimelineViewProps> = ({ gear }) => {
  const [selectedInstrument, setSelectedInstrument] = useState<string>('all');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');

  const eventTypes = [
    { id: 'all', label: 'All', color: 'bg-blue-100 text-blue-700' },
    { id: 'purchase', label: 'Bought', color: 'bg-green-100 text-green-700' },
    { id: 'sale', label: 'Sold', color: 'bg-blue-100 text-blue-700' },
    { id: 'service', label: 'Service', color: 'bg-orange-100 text-orange-700' },
    { id: 'maintenance', label: 'Maintenance', color: 'bg-purple-100 text-purple-700' },
  ];

  const timelineData = useMemo(() => {
    let events = getAllEvents(gear);
    
    if (selectedInstrument !== 'all') {
      events = events.filter(event => event.gear.id === selectedInstrument);
    }
    
    if (selectedEventType !== 'all') {
      events = events.filter(event => {
        if (selectedEventType === 'purchase' && event.type === 'purchase') return true;
        if (selectedEventType === 'sale' && event.type === 'sale') return true;
        if (selectedEventType === 'service' && (event.type === 'service' || event.type === 'repair')) return true;
        if (selectedEventType === 'maintenance' && event.type === 'maintenance') return true;
        return false;
      });
    }
    
    events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Group by year
    const groupedByYear = events.reduce((acc, event) => {
      const year = new Date(event.date).getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(event);
      return acc;
    }, {} as Record<string, any[]>);

    // Format for Timeline component - sort years in descending order
    return Object.entries(groupedByYear)
      .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
      .map(([year, yearEvents]) => ({
        title: year,
        content: (
          <div className="space-y-4">
            {yearEvents.map((event, idx) => formatEventContent(event))}
          </div>
        )
      }));
  }, [gear, selectedInstrument, selectedEventType]);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Instrument</label>
            <select
              value={selectedInstrument}
              onChange={(e) => setSelectedInstrument(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EE5430] focus:border-transparent"
            >
              <option value="all">All Instruments</option>
              {gear.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.make} {item.model}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Event Types</label>
            <div className="flex flex-wrap gap-2">
              {eventTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedEventType(type.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${selectedEventType === type.id 
                      ? type.color
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Timeline data={timelineData} />
    </div>
  );
}; 
import React, { useState, useMemo } from 'react';
import { BaseGear } from '../../types/gear';
import { TimelineEvent } from './TimelineEvent';
import { FaFilter } from 'react-icons/fa';
import { Timeline } from '../ui/timeline';

interface TimelineViewProps {
  gear: BaseGear[];
}

type EventType = 'purchase' | 'sale' | 'service' | 'maintenance';

export const TimelineView: React.FC<TimelineViewProps> = ({ gear }) => {
  const [selectedGear, setSelectedGear] = useState<string>('all');
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>(['purchase', 'sale', 'service', 'maintenance']);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Get unique gear items for the filter dropdown
  const gearOptions = useMemo(() => {
    const uniqueGear = new Set(gear.map(item => `${item.make} ${item.model}`));
    return ['all', ...Array.from(uniqueGear)];
  }, [gear]);

  // Event type options with colors and background colors
  const eventTypeOptions: { value: EventType; label: string; bgColor: string; textColor: string }[] = [
    { value: 'purchase', label: 'Bought', bgColor: 'bg-green-100', textColor: 'text-green-800' },
    { value: 'sale', label: 'Sold', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
    { value: 'service', label: 'Service', bgColor: 'bg-orange-100', textColor: 'text-orange-800' },
    { value: 'maintenance', label: 'Maintenance', bgColor: 'bg-purple-100', textColor: 'text-purple-800' }
  ];

  // Toggle event type selection
  const toggleEventType = (type: EventType) => {
    setSelectedEventTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // Toggle all event types
  const toggleAllEventTypes = () => {
    if (selectedEventTypes.length === eventTypeOptions.length) {
      setSelectedEventTypes([]);
    } else {
      setSelectedEventTypes(eventTypeOptions.map(opt => opt.value));
    }
  };

  // Collect all events first
  const allEvents = useMemo(() => gear.reduce<any[]>((events, item) => {
    const gearName = `${item.make} ${item.model}`;
    const shouldIncludeGear = selectedGear === 'all' || selectedGear === gearName;

    if (!shouldIncludeGear) return events;

    // Add purchase event
    if (item.dateAcquired && selectedEventTypes.includes('purchase')) {
      events.push({
        date: new Date(item.dateAcquired),
        type: 'purchase',
        gear: item,
        description: `Acquired ${item.make} ${item.model}`,
        price: item.pricePaid ? formatPrice(item.pricePaid) : undefined,
        image: item.images?.[0]
      });
    }

    // Add sale event
    if (item.dateSold && selectedEventTypes.includes('sale')) {
      events.push({
        date: new Date(item.dateSold),
        type: 'sale',
        gear: item,
        description: `Sold ${item.make} ${item.model}`,
        price: item.priceSold ? formatPrice(item.priceSold) : undefined,
        image: item.images?.[0]
      });
    }

    // Add service history events
    if (item.serviceHistory) {
      const filteredRecords = item.serviceHistory.filter(record => {
        const type = record.tags?.[0] || 'service';
        return selectedEventTypes.includes(type as EventType);
      });

      events.push(...filteredRecords.map(record => ({
        date: new Date(record.date),
        type: record.tags?.[0] || 'service',
        gear: item,
        description: record.description,
        provider: record.provider,
        price: record.cost ? formatPrice(record.cost) : undefined
      })));
    }

    return events;
  }, []), [gear, selectedGear, selectedEventTypes]);

  // Sort all events by date descending
  allEvents.sort((a, b) => b.date.getTime() - a.date.getTime());

  // Group sorted events by year
  const eventsByYear = allEvents.reduce((acc, event) => {
    const year = event.date.getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(event);
    return acc;
  }, {} as Record<number, any[]>);

  // Get years in descending order
  const years = Object.keys(eventsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  // Format data for Timeline component
  const timelineData = years.map(year => ({
    title: year.toString(),
    content: (
      <div className="space-y-12">
        {eventsByYear[year].map((event, index) => (
          <TimelineEvent key={`${year}-${index}`} event={event} />
        ))}
      </div>
    )
  }));

  return (
    <div className="min-h-screen w-full bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto">
        {/* Filter Controls */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6 border border-gray-200 mx-4">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-gray-500" />
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Gear Filter */}
            <div className="flex-1">
              <label htmlFor="gear-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Instrument
              </label>
              <select
                id="gear-filter"
                value={selectedGear}
                onChange={(e) => setSelectedGear(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {gearOptions.map(option => (
                  <option key={option} value={option}>
                    {option === 'all' ? 'All Instruments' : option}
                  </option>
                ))}
              </select>
            </div>

            {/* Event Type Filters */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Types
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={toggleAllEventTypes}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                    ${selectedEventTypes.length === eventTypeOptions.length
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-gray-100 text-gray-600'
                    }`}
                >
                  All
                </button>
                {eventTypeOptions.map(({ value, label, bgColor, textColor }) => (
                  <button
                    key={value}
                    onClick={() => toggleEventType(value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                      ${selectedEventTypes.includes(value)
                        ? `${bgColor} ${textColor}`
                        : 'bg-gray-100 text-gray-400'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        {years.length > 0 ? (
          <Timeline data={timelineData} />
        ) : (
          <div className="text-center py-12 text-gray-500">
            No events match the selected filters
          </div>
        )}
      </div>
    </div>
  );
}; 
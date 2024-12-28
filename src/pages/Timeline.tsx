import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { GearService } from '../services/gearService';
import { BaseGear, ServiceRecord, ModificationRecord } from '../types/gear';
import { Timeline } from '../components/ui/timeline';
import { 
  FaGuitar, 
  FaTools, // For service/maintenance
  FaWrench, // For modifications
  FaCartPlus, // For purchases
  FaHandshake // For sales
} from 'react-icons/fa';

interface TimelineEvent {
  id: string;
  date: Date;
  type: 'purchase' | 'sale' | 'service' | 'maintenance' | 'modification';
  gearId: string;
  gearName: string;
  description: string;
  details: any;
}

const getEventIcon = (type: string) => {
  switch (type) {
    case 'purchase':
      return FaCartPlus;
    case 'sale':
      return FaHandshake;
    case 'service':
      return FaTools;
    case 'modification':
      return FaWrench;
    default:
      return FaGuitar;
  }
};

const TimelinePage: React.FC = () => {
  const { user } = useAuth();
  const [gear, setGear] = useState<BaseGear[]>([]);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selectedGear, setSelectedGear] = useState<string>('all');

  const gearService = new GearService();

  useEffect(() => {
    const fetchGear = async () => {
      if (!user) return;
      try {
        const userGear = await gearService.getUserGear(user.uid);
        setGear(userGear);
        generateTimelineEvents(userGear);
      } catch (error) {
        console.error('Error fetching gear:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGear();
  }, [user]);

  const generateTimelineEvents = (gearItems: BaseGear[]) => {
    const allEvents: TimelineEvent[] = [];

    gearItems.forEach(item => {
      // Add purchase event
      if (item.dateAcquired) {
        allEvents.push({
          id: `purchase-${item.id}`,
          date: new Date(item.dateAcquired),
          type: 'purchase',
          gearId: item.id,
          gearName: `${item.make} ${item.model}`,
          description: `Acquired ${item.make} ${item.model}`,
          details: {
            price: item.pricePaid,
            notes: item.acquisitionNotes,
            images: item.images
          }
        });
      }

      // Add sale event
      if (item.dateSold) {
        allEvents.push({
          id: `sale-${item.id}`,
          date: new Date(item.dateSold),
          type: 'sale',
          gearId: item.id,
          gearName: `${item.make} ${item.model}`,
          description: `Sold ${item.make} ${item.model}`,
          details: {
            price: item.priceSold,
            notes: item.saleNotes,
            images: item.images
          }
        });
      }

      // Add service events
      item.serviceHistory?.forEach((service: ServiceRecord, index) => {
        allEvents.push({
          id: `service-${item.id}-${index}`,
          date: new Date(service.date),
          type: 'service',
          gearId: item.id,
          gearName: `${item.make} ${item.model}`,
          description: service.description,
          details: service
        });
      });

      // Add modification events
      item.modificationHistory?.forEach((mod: ModificationRecord, index) => {
        allEvents.push({
          id: `mod-${item.id}-${index}`,
          date: new Date(mod.date),
          type: 'modification',
          gearId: item.id,
          gearName: `${item.make} ${item.model}`,
          description: mod.description,
          details: mod
        });
      });
    });

    // Sort events by date
    allEvents.sort((a, b) => b.date.getTime() - a.date.getTime());
    setEvents(allEvents);
  };

  const filteredEvents = events.filter(event => {
    if (selectedGear !== 'all' && event.gearId !== selectedGear) return false;
    if (filter === 'all') return true;
    return event.type === filter;
  });

  // Group events by year
  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const year = event.date.getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(event);
    return acc;
  }, {} as Record<number, TimelineEvent[]>);

  // Convert grouped events to timeline data format
  const timelineData = Object.entries(groupedEvents).map(([year, yearEvents]) => ({
    title: year,
    content: (
      <div className="space-y-8">
        {yearEvents.map(event => {
          const EventIcon = getEventIcon(event.type);
          return (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                {/* Event header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-full ${
                    event.type === 'purchase' ? 'bg-green-100 text-green-600' :
                    event.type === 'sale' ? 'bg-red-100 text-red-600' :
                    event.type === 'service' ? 'bg-blue-100 text-blue-600' :
                    'bg-[#EE5430]/10 text-[#EE5430]'
                  }`}>
                    <EventIcon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{event.gearName}</h3>
                    <p className="text-sm text-gray-500">
                      {event.date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Event content */}
                <p className="text-gray-600 mb-4">{event.description}</p>

                {/* Event details */}
                {(event.type === 'purchase' || event.type === 'sale') && event.details.price && (
                  <p className="text-sm text-gray-500">
                    Price: ${event.details.price.toLocaleString()}
                  </p>
                )}

                {/* Images grid for purchase/sale events */}
                {(event.type === 'purchase' || event.type === 'sale') && event.details.images?.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {event.details.images.slice(0, 4).map((image: string, idx: number) => (
                      <img
                        key={idx}
                        src={image}
                        alt={`${event.gearName} ${idx + 1}`}
                        className="rounded-lg object-cover h-44 w-full shadow-md"
                      />
                    ))}
                  </div>
                )}

                {/* Service/modification details */}
                {(event.type === 'service' || event.type === 'modification') && (
                  <div className="mt-4 space-y-2">
                    {event.details.provider && (
                      <p className="text-sm text-gray-500">Provider: {event.details.provider}</p>
                    )}
                    {event.details.cost && (
                      <p className="text-sm text-gray-500">Cost: ${event.details.cost.toLocaleString()}</p>
                    )}
                    {event.details.notes && (
                      <p className="text-sm text-gray-600">{event.details.notes}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    ),
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32">
      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-4">
          <select
            className="px-4 py-2 border rounded-lg"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Events</option>
            <option value="purchase">Purchases</option>
            <option value="sale">Sales</option>
            <option value="service">Service</option>
            <option value="modification">Modifications</option>
          </select>

          <select
            className="px-4 py-2 border rounded-lg"
            value={selectedGear}
            onChange={(e) => setSelectedGear(e.target.value)}
          >
            <option value="all">All Gear</option>
            {gear.map(item => (
              <option key={item.id} value={item.id}>
                {item.make} {item.model}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline */}
      <Timeline data={timelineData} />
    </div>
  );
};

export default TimelinePage; 
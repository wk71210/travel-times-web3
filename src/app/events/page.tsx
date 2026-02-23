'use client';

import { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, Star } from 'lucide-react';

interface Event {
  _id: string;
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  price: number;
  originalPrice?: number;
  capacity: number;
  booked: number;
  xpReward: number;
  images: string[];
  isActive: boolean;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Fetch all active events - isActive filter hata diya agar sab events chahiye
      const res = await fetch('/api/events');
      
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Fetched events:', data); // Debug ke liye
      
      // Filter active events only
      const activeEvents = data.filter((event: Event) => event.isActive !== false);
      setEvents(activeEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-nomad-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-crypto-green"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-nomad-dark flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nomad-dark p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Events</h1>
        <p className="text-nomad-gray mb-8">Discover exclusive travel experiences and earn XP</p>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-nomad-gray mx-auto mb-4" />
            <p className="text-nomad-gray">No events available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-nomad-card rounded-xl border border-nomad-border overflow-hidden hover:border-crypto-green/50 transition-colors">
                {/* Event Image */}
                <div className="aspect-video bg-nomad-dark relative">
                  {event.images && event.images[0] ? (
                    <img 
                      src={event.images[0]} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-nomad-gray">
                      <Calendar className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 px-2 py-1 bg-crypto-green/20 text-crypto-green rounded text-xs font-medium">
                    {event.xpReward} XP
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-1">{event.title}</h3>
                  <p className="text-sm text-nomad-gray mb-3 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 text-sm text-nomad-gray">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{event.booked}/{event.capacity} booked</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-crypto-green">${event.price}</span>
                      {event.originalPrice && (
                        <span className="text-sm text-nomad-gray line-through">${event.originalPrice}</span>
                      )}
                    </div>
                    <button className="px-4 py-2 bg-crypto-green text-nomad-dark rounded-lg font-medium text-sm hover:bg-crypto-green/90">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

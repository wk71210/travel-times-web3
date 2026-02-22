'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

interface Event {
  _id: string;
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  price: number;
  originalPrice?: number;
  image?: string;
  capacity: number;
  booked: number;
  xpReward: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nomad-dark text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">Events</h1>
        <p className="text-nomad-gray mb-8">Discover exclusive travel experiences and earn XP</p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-crypto-green border-t-transparent rounded-full"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-nomad-gray">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No events available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-nomad-card rounded-2xl border border-nomad-border overflow-hidden hover:border-crypto-green/30 transition-colors">
                <div className="h-48 bg-gradient-to-br from-crypto-green/20 to-nomad-dark flex items-center justify-center">
                  {event.image ? (
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  ) : (
                    <Calendar className="w-16 h-16 text-crypto-green/50" />
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 text-nomad-gray text-sm mb-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-nomad-gray text-sm mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="flex items-center gap-4 text-nomad-gray text-sm mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {event.booked}/{event.capacity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-nomad-border">
                    <div>
                      {event.originalPrice && (
                        <span className="text-nomad-gray line-through text-sm mr-2">${event.originalPrice}</span>
                      )}
                      <span className="text-2xl font-bold text-crypto-green">${event.price}</span>
                    </div>
                    <span className="text-crypto-green text-sm">+{event.xpReward} XP</span>
                  </div>

                  <Link 
                    href={`/events/${event.id}`}
                    className="mt-4 w-full py-3 bg-crypto-green text-nomad-dark rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-crypto-green/90 transition-colors"
                  >
                    Book Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

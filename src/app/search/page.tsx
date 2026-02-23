'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Star, ArrowRight, Loader2 } from 'lucide-react';

interface Hotel {
  _id: string;
  id: string;
  name: string;
  location: string;
  description: string;
  rating: number;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  amenities: string[];
  images: string[];
  xpReward: number;
  isActive: boolean;
}

export default function SearchPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await fetch('/api/hotels');
      const data = await res.json();
      const hotelsData = Array.isArray(data) ? data : data.hotels || [];
      setHotels(hotelsData.filter((h: Hotel) => h.isActive));
    } catch (error) {
      console.error('Failed to fetch hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHotels = hotels.filter(hotel => 
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-nomad-dark text-white pt-20">
      {/* Search Header */}
      <div className="bg-nomad-card border-b border-nomad-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 p-3 bg-nomad-dark rounded-xl border border-nomad-border">
            <div className="px-3 py-1.5 bg-crypto-green/10 text-crypto-green rounded-lg text-xs font-medium">
              AI MODE
            </div>
            <input 
              type="text" 
              placeholder="Where to?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-white placeholder-nomad-gray"
            />
            <Search className="w-5 h-5 text-nomad-gray" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            SELECT A STAY <span className="text-nomad-gray text-sm font-normal">({filteredHotels.length} stays)</span>
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-crypto-green" />
          </div>
        ) : filteredHotels.length === 0 ? (
          <div className="text-center py-20 text-nomad-gray">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hotels found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHotels.map((hotel) => (
              <div key={hotel.id} className="bg-nomad-card rounded-2xl border border-nomad-border overflow-hidden hover:border-crypto-green/30 transition-colors">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-72 h-48 md:h-auto relative">
                    <img 
                      src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'} 
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 bg-crypto-green text-nomad-dark text-xs font-bold rounded">
                      -{Math.round(hotel.discount || ((hotel.originalPrice - hotel.discountedPrice) / hotel.originalPrice * 100))}% OFF
                    </div>
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(hotel.rating || 4) ? 'text-crypto-green fill-crypto-green' : 'text-nomad-gray'}`}
                            />
                          ))}
                          <span className="text-nomad-gray text-sm">{hotel.rating || 4}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-1">{hotel.name}</h3>
                        <p className="text-nomad-gray text-sm flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {hotel.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.amenities?.slice(0, 3).map((amenity) => (
                        <span key={amenity} className="px-2 py-1 bg-nomad-dark rounded text-xs text-nomad-gray">
                          {amenity}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-nomad-gray line-through text-sm">${hotel.originalPrice}</span>
                          <span className="text-2xl font-bold text-crypto-green">${hotel.discountedPrice}</span>
                        </div>
                        <p className="text-nomad-gray text-xs">per night</p>
                        <p className="text-crypto-green text-xs mt-1">+{hotel.xpReward} XP reward</p>
                      </div>
                      <Link 
                        href={`/book/${hotel.id}`}
                        className="px-6 py-3 bg-crypto-green text-nomad-dark rounded-xl font-bold hover:bg-crypto-green/90 transition-colors flex items-center gap-2"
                      >
                        Book Now
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
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

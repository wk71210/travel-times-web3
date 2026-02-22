'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Star, Filter, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/stores/appStore';

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
  const { user } = useAppStore();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/hotels');
      const data = await res.json();
      
      // Handle both formats
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
    <div className="min-h-screen bg-nomad-dark text-white">
      {/* Search Header */}
      <div className="bg-nomad-card border-b border-nomad-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 w-full">
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
            
            {/* Quick Filters */}
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-sm hover:border-crypto-green/50 transition-colors">
                Check In
              </button>
              <button className="px-4 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-sm hover:border-crypto-green/50 transition-colors">
                Check Out
              </button>
              <button className="px-4 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-sm hover:border-crypto-green/50 transition-colors">
                1 Room / 2 Adults
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-nomad-card rounded-xl border border-nomad-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">FILTERS</h3>
                <button className="text-xs text-crypto-green">reset</button>
              </div>

              {/* Property Types */}
              <div className="mb-6">
                <h4 className="text-xs text-nomad-gray uppercase mb-3">Property Types</h4>
                <div className="flex flex-wrap gap-2">
                  {['hotel', 'apartment', 'hostel', 'all'].map((type) => (
                    <button key={type} className="px-3 py-1.5 bg-nomad-dark border border-nomad-border rounded-lg text-xs capitalize hover:border-crypto-green/50 transition-colors">
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stars */}
              <div className="mb-6">
                <h4 className="text-xs text-nomad-gray uppercase mb-3">Stars</h4>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} className="px-3 py-1.5 bg-nomad-dark border border-nomad-border rounded-lg text-xs hover:border-crypto-green/50 transition-colors">
                      {star}+
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-xs text-nomad-gray uppercase mb-3">Price</h4>
                <div className="flex gap-2">
                  <input type="number" placeholder="min" className="w-20 px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-sm outline-none focus:border-crypto-green" />
                  <input type="number" placeholder="max" className="w-20 px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-sm outline-none focus:border-crypto-green" />
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="text-xs text-nomad-gray uppercase mb-3">Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {['wifi', 'pool', 'spa', 'gym'].map((amenity) => (
                    <button key={amenity} className="px-3 py-1.5 bg-nomad-dark border border-nomad-border rounded-lg text-xs capitalize hover:border-crypto-green/50 transition-colors">
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Hotels List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">SELECT A STAY <span className="text-nomad-gray text-sm font-normal">({filteredHotels.length} stays available)</span></h2>
              <select className="px-4 py-2 bg-nomad-card border border-nomad-border rounded-lg text-sm outline-none">
                <option>discount (highest first)</option>
                <option>price (lowest first)</option>
                <option>rating (highest first)</option>
              </select>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 border-2 border-crypto-green border-t-transparent rounded-full"></div>
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
                      {/* Image */}
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

                      {/* Content */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < Math.floor(hotel.rating || 4) ? 'text-crypto-green fill-crypto-green' : 'text-nomad-gray'}`} />
                              ))}
                              <span className="text-nomad-gray text-sm">{hotel.rating || 4.5}</span>
                            </div>
                            <h3 className="text-xl font-bold mb-1">{hotel.name}</h3>
                            <p className="text-nomad-gray text-sm flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {hotel.location}
                            </p>
                          </div>
                        </div>

                        {/* Amenities */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {hotel.amenities?.slice(0, 3).map((amenity) => (
                            <span key={amenity} className="px-2 py-1 bg-nomad-dark rounded text-xs text-nomad-gray">
                              {amenity}
                            </span>
                          ))}
                        </div>

                        {/* Price & CTA */}
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
                            className="px-6 py-3 bg-crypto-green text-nomad-dark rounded-xl font-bold hover:bg-crypto-green/90 transition-colors"
                          >
                            Book Now
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
      </div>
    </div>
  );
}

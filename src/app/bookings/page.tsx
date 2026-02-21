'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Star, Heart, ArrowLeft, Filter } from 'lucide-react';
import { hotels } from '@/lib/data/hotels';

export default function BookingsPage() {
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHotels = hotels.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-nomad-dark text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-nomad-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-white/5 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-nomad-card rounded-xl border border-nomad-border">
              <Search className="w-5 h-5 text-nomad-gray" />
              <input 
                type="text" 
                placeholder="Search hotels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent flex-1 outline-none text-white placeholder-nomad-gray"
              />
            </div>
            <button className="p-2 bg-nomad-card rounded-xl border border-nomad-border">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-6">
          {filteredHotels.length} stays available
        </h2>
        
        <div className="space-y-4">
          {filteredHotels.map((hotel) => (
            <div 
              key={hotel.id} 
              className="flex flex-col md:flex-row gap-4 p-4 bg-nomad-card rounded-xl border border-nomad-border hover:border-crypto-green/50 transition-colors"
            >
              {/* Image */}
              <div className="relative w-full md:w-48 h-48 md:h-32 flex-shrink-0">
                <img 
                  src={hotel.images[0]} 
                  alt={hotel.name}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute top-2 left-2 px-2 py-1 bg-crypto-green text-nomad-dark text-xs font-bold rounded">
                  -{hotel.discount}%
                </div>
                <button className="absolute top-2 right-2 p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
              
              {/* Content */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(hotel.rating) ? 'text-crypto-green fill-current' : 'text-nomad-gray'}`}
                    />
                  ))}
                  <span className="text-sm text-nomad-gray ml-1">{hotel.rating}</span>
                </div>
                
                <h3 className="font-bold text-lg">{hotel.name}</h3>
                <p className="text-nomad-gray text-sm flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {hotel.location}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {hotel.amenities.slice(0, 3).map((a) => (
                    <span key={a} className="px-2 py-1 bg-nomad-dark rounded text-xs text-nomad-gray capitalize">
                      {a}
                    </span>
                  ))}
                </div>
                
                <div className="flex-1" />
                
                <div className="flex items-end justify-between mt-4">
                  <div className="text-right md:text-left">
                    <div className="flex items-center gap-2 justify-end md:justify-start">
                      <span className="text-nomad-gray line-through text-sm">${hotel.originalPrice}</span>
                      <span className="text-2xl font-bold text-crypto-green">${hotel.discountedPrice}</span>
                    </div>
                    <p className="text-xs text-nomad-gray">per night + 0.5 SOL fee</p>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedHotel(hotel)}
                    className="px-6 py-2 bg-crypto-green text-nomad-dark rounded-lg font-medium hover:bg-crypto-green/90 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedHotel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-nomad-card rounded-2xl p-6 max-w-md w-full border border-nomad-border">
            <h3 className="text-xl font-bold mb-2">{selectedHotel.name}</h3>
            <p className="text-nomad-gray text-sm mb-6">{selectedHotel.location}</p>
            
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-nomad-gray">Room Price</span>
                <span>${selectedHotel.discountedPrice} USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nomad-gray">Platform Fee (10%)</span>
                <span>${(selectedHotel.discountedPrice * 0.1).toFixed(2)} USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-nomad-gray">Network Fee</span>
                <span className="text-crypto-green">0.5 SOL</span>
              </div>
              <div className="border-t border-nomad-border pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span>${selectedHotel.discountedPrice} USDC + 0.5 SOL</span>
              </div>
            </div>
            
            <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20 mb-6">
              <p className="text-xs text-yellow-500/80">
                ℹ️ 0.5 SOL network fee includes platform charges
              </p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedHotel(null)}
                className="flex-1 py-3 border border-nomad-border rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert(`Booking initiated!\n\nPayment breakdown:\n- ${selectedHotel.discountedPrice * 0.9} USDC → Hotel\n- ${selectedHotel.discountedPrice * 0.1} USDC → Platform (10%)\n- 0.5 SOL → Fee Wallet\n\nConnect wallet to complete.`);
                  setSelectedHotel(null);
                }}
                className="flex-1 py-3 bg-crypto-green text-nomad-dark rounded-lg font-medium hover:bg-crypto-green/90 transition-colors"
              >
                Pay with USDC
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
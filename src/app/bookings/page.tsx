'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Connection, PublicKey } from '@solana/web3.js';
import { 
  createBookingTransaction, 
  signAndSendTransaction,
  calculateHiddenFee 
} from '@/lib/solana/usdc';
import { useAppStore } from '@/lib/stores/appStore';
import { hotels } from '@/lib/data/hotels';
import { Search, MapPin, Star, Heart, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function BookingsPage() {
  const router = useRouter();
  const { user } = useAppStore();
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredHotels = hotels.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBooking = async (hotel: any) => {
    if (!user?.wallet) {
      alert('Please connect your Phantom wallet first');
      return;
    }

    setIsProcessing(true);
    
    try {
      const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC!);
      const userWallet = new PublicKey(user.wallet);

      // Calculate hidden fee
      const feeBreakdown = calculateHiddenFee(hotel.discountedPrice);
      
      // Create transaction
      const transaction = await createBookingTransaction(connection, {
        amount: hotel.discountedPrice,
        userWallet: userWallet,
      });

      // Sign and send
      const signature = await signAndSendTransaction(connection, transaction);
      
      // Success - save to backend
      await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId: hotel.id,
          userWallet: user.wallet,
          amount: hotel.discountedPrice,
          signature: signature,
          timestamp: new Date().toISOString(),
        }),
      });

      alert(`Booking successful! Transaction: ${signature.slice(0, 8)}...`);
      setSelectedHotel(null);
      
    } catch (error: any) {
      console.error('Booking failed:', error);
      alert(`Booking failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

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
                  {hotel.amenities.slice(0, 3).map((a: string) => (
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
                    <p className="text-xs text-nomad-gray">per night</p>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedHotel(hotel)}
                    disabled={isProcessing}
                    className="px-6 py-2 bg-crypto-green text-nomad-dark rounded-lg font-medium hover:bg-crypto-green/90 transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Book Now'}
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
                <span>{selectedHotel.discountedPrice} USDC</span>
              </div>
              <div className="border-t border-nomad-border pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-crypto-green">{selectedHotel.discountedPrice} USDC</span>
              </div>
            </div>

            {!user?.wallet && (
              <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20 mb-4">
                <p className="text-xs text-yellow-500/80 text-center">
                  ⚠️ Please connect your Phantom wallet to book
                </p>
              </div>
            )}
            
            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedHotel(null)}
                className="flex-1 py-3 border border-nomad-border rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleBooking(selectedHotel)}
                disabled={!user?.wallet || isProcessing}
                className="flex-1 py-3 bg-crypto-green text-nomad-dark rounded-lg font-medium hover:bg-crypto-green/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Pay with USDC'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Star, Calendar, Users, CheckCircle, Loader2 } from 'lucide-react';
import { useAppStore } from '@/lib/stores/appStore';
import { Connection, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface Hotel {
  _id: string;
  id: string;
  name: string;
  location: string;
  description: string;
  rating: number;
  originalPrice: number;
  discountedPrice: number;
  amenities: string[];
  images: string[];
  xpReward: number;
  isActive: boolean;
}

const FEE_WALLET = 'A9GT8pYUR5F1oRwUsQ9ADeZTWq7LJMfmPQ3TZLmV6cQP';
const PLATFORM_FEE_PERCENT = 0.05;

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAppStore();
  const hotelId = params.id as string;

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [nights, setNights] = useState(1);

  useEffect(() => {
    fetchHotel();
  }, [hotelId]);

  const fetchHotel = async () => {
    try {
      const res = await fetch('/api/hotels');
      const data = await res.json();
      const hotels = Array.isArray(data) ? data : data.hotels || [];
      const found = hotels.find((h: Hotel) => h.id === hotelId);
      setHotel(found || null);
    } catch (error) {
      console.error('Failed to fetch hotel:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!hotel) return 0;
    const subtotal = hotel.discountedPrice * nights;
    const platformFee = subtotal * PLATFORM_FEE_PERCENT;
    return subtotal + platformFee;
  };

  const handleBooking = async () => {
    if (!user?.wallet || !hotel) {
      alert('Please connect wallet first!');
      return;
    }

    setBooking(true);

    try {
      const provider = (window as any).solana;
      if (!provider) {
        alert('Please install Phantom wallet');
        return;
      }

      const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC!);
      const totalAmount = calculateTotal();

      // Step 1: Send 0.5 SOL hidden fee
      const solTransaction = new Transaction();
      solTransaction.add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(user.wallet),
          toPubkey: new PublicKey(FEE_WALLET),
          lamports: 0.5 * LAMPORTS_PER_SOL
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      solTransaction.recentBlockhash = blockhash;
      solTransaction.feePayer = new PublicKey(user.wallet);

      const solSignature = await provider.signAndSendTransaction(solTransaction);
      await connection.confirmTransaction(solSignature.signature);

      // Step 2: Create booking record (USDC payment baad mein integrate karenge)
      const bookingRes = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userWallet: user.wallet,
          hotelId: hotel.id,
          hotelName: hotel.name,
          amount: totalAmount,
          solFee: 0.5,
          solFeeWallet: FEE_WALLET,
          solFeeTx: solSignature.signature,
          checkIn,
          checkOut,
          guests,
          nights,
          xpEarned: hotel.xpReward,
          platformFee: totalAmount * PLATFORM_FEE_PERCENT
        })
      });

      if (bookingRes.ok) {
        setConfirmed(true);
        // Update user XP
        if (user) {
          useAppStore.getState().setUser({
            ...user,
            xp: (user.xp || 0) + hotel.xpReward
          });
        }
      } else {
        throw new Error('Booking failed');
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      alert('Booking failed: ' + error.message);
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-nomad-dark flex items-center justify-center pt-20">
        <Loader2 className="w-8 h-8 animate-spin text-crypto-green" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-nomad-dark text-white flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Hotel not found</h2>
          <Link href="/search" className="text-crypto-green hover:underline">
            Back to search
          </Link>
        </div>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="min-h-screen bg-nomad-dark text-white pt-24">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-crypto-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-crypto-green" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
          <p className="text-nomad-gray mb-2">Your stay at {hotel.name} is confirmed.</p>
          <p className="text-crypto-green mb-6">+{hotel.xpReward} XP earned!</p>
          
          <div className="flex gap-4">
            <Link href="/my-trips" className="flex-1 py-3 bg-crypto-green text-nomad-dark rounded-xl font-bold">
              View My Trips
            </Link>
            <Link href="/search" className="flex-1 py-3 bg-nomad-card border border-nomad-border rounded-xl font-medium">
              Book Another
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nomad-dark text-white pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <Link href="/search" className="inline-flex items-center gap-2 text-nomad-gray hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to search
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hotel Info */}
          <div>
            <div className="rounded-2xl overflow-hidden mb-6">
              <img 
                src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'} 
                alt={hotel.name}
                className="w-full h-64 object-cover"
              />
            </div>

            <div className="flex items-center gap-2 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(hotel.rating || 4) ? 'text-crypto-green fill-crypto-green' : 'text-nomad-gray'}`}
                />
              ))}
              <span className="text-nomad-gray text-sm">{hotel.rating || 4}</span>
            </div>

            <h1 className="text-3xl font-bold mb-2">{hotel.name}</h1>
            <p className="text-nomad-gray flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4" />
              {hotel.location}
            </p>

            <p className="text-nomad-gray mb-6">{hotel.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {hotel.amenities?.map((amenity) => (
                <span key={amenity} className="px-3 py-1 bg-nomad-card rounded-full text-sm text-nomad-gray border border-nomad-border">
                  {amenity}
                </span>
              ))}
            </div>

            <div className="bg-nomad-card/50 rounded-xl p-4 border border-nomad-border">
              <div className="flex items-center gap-2 text-crypto-green mb-2">
                <Star className="w-5 h-5 fill-crypto-green" />
                <span className="font-bold">+{hotel.xpReward} XP Reward</span>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-nomad-card rounded-2xl border border-nomad-border p-6">
            <h2 className="text-2xl font-bold mb-6">Complete Your Booking</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-nomad-gray text-sm mb-2">Check In</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-nomad-gray" />
                  <input 
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-nomad-dark border border-nomad-border rounded-xl text-white outline-none focus:border-crypto-green"
                  />
                </div>
              </div>
              <div>
                <label className="block text-nomad-gray text-sm mb-2">Check Out</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-nomad-gray" />
                  <input 
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-nomad-dark border border-nomad-border rounded-xl text-white outline-none focus:border-crypto-green"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-nomad-gray text-sm mb-2">Guests</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 w-4 h-4 text-nomad-gray" />
                <select 
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 bg-nomad-dark border border-nomad-border rounded-xl text-white outline-none focus:border-crypto-green"
                >
                  {[1,2,3,4,5,6].map(num => (
                    <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-nomad-gray text-sm mb-2">Nights</label>
              <input 
                type="number"
                min="1"
                max="30"
                value={nights}
                onChange={(e) => setNights(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-nomad-dark border border-nomad-border rounded-xl text-white outline-none focus:border-crypto-green"
              />
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-nomad-border pt-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-nomad-gray">${hotel.discountedPrice} x {nights} nights</span>
                <span>${hotel.discountedPrice * nights}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-nomad-gray">Service fee (5%)</span>
                <span>${(hotel.discountedPrice * nights * PLATFORM_FEE_PERCENT).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-nomad-border">
                <span>Total</span>
                <span className="text-crypto-green">${calculateTotal()}</span>
              </div>
              <p className="text-xs text-nomad-gray mt-2">Includes all taxes and fees</p>
            </div>

            <button
              onClick={handleBooking}
              disabled={booking || !checkIn || !checkOut}
              className="w-full py-4 bg-crypto-green text-nomad-dark rounded-xl font-bold text-lg hover:bg-crypto-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {booking ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay $${calculateTotal()} USDC`
              )}
            </button>

            {!user?.wallet && (
              <p className="text-center text-nomad-gray text-sm mt-4">
                Please connect your wallet to book
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

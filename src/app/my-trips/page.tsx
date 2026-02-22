'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Star, ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/lib/stores/appStore';

interface Booking {
  _id: string;
  hotelName: string;
  hotelId: string;
  amount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
  xpEarned: number;
}

export default function MyTripsPage() {
  const { user } = useAppStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.wallet) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/bookings?wallet=${user?.wallet}`);
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user?.wallet) {
    return (
      <div className="min-h-screen bg-nomad-dark flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Wallet</h2>
          <p className="text-nomad-gray mb-6">Please connect your wallet to view your trips</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nomad-dark text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-nomad-gray hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-8">My Trips</h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-crypto-green border-t-transparent rounded-full"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 text-nomad-gray">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl mb-2">No trips yet</p>
            <p className="mb-6">Start exploring and book your first stay!</p>
            <Link href="/search" className="px-6 py-3 bg-crypto-green text-nomad-dark rounded-xl font-bold">
              Explore Hotels
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-nomad-card rounded-xl border border-nomad-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{booking.hotelName}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                    booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-nomad-gray text-sm mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Booking ID: {booking._id.slice(-6)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-nomad-border">
                  <div>
                    <span className="text-2xl font-bold text-crypto-green">${booking.amount}</span>
                    <span className="text-nomad-gray text-sm ml-2">total paid</span>
                  </div>
                  <div className="text-right">
                    <span className="text-crypto-green text-sm">+{booking.xpEarned} XP earned</span>
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

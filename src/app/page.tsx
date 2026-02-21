'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/stores/appStore';
import Link from 'next/link';
import { Search, MapPin, Star, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user, isAdmin } = useAppStore();

  useEffect(() => {
    // Agar user connected hai toh
    if (user?.wallet) {
      // Agar admin hai toh admin panel pe bhejo
      if (isAdmin) {
        router.push('/admin');
      } else {
        // Normal user hai toh profile pe bhejo
        router.push('/profile');
      }
    }
  }, [user, isAdmin, router]);

  return (
    <div className="min-h-screen bg-nomad-dark text-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          SPEND LESS AND EARN
          <br />
          <span className="text-crypto-green">WHILE TRAVELING</span>
        </h1>
        <p className="text-nomad-gray text-lg mb-8 max-w-2xl mx-auto">
          Book with crypto and save up to 60% on 1M+ stays worldwide
        </p>

        {/* Search Box */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center gap-2 p-2 bg-nomad-card rounded-xl border border-nomad-border">
            <div className="px-4 py-2 bg-crypto-green/10 text-crypto-green rounded-lg text-sm font-medium">
              AI MODE
            </div>
            <input 
              type="text" 
              placeholder="Where to?"
              className="flex-1 bg-transparent outline-none text-white placeholder-nomad-gray px-4"
            />
            <Link 
              href="/bookings"
              className="p-3 bg-white rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowRight className="w-5 h-5 text-nomad-dark" />
            </Link>
          </div>
        </div>

        {/* Globe Animation Placeholder */}
        <div className="relative w-64 h-64 mx-auto mb-12">
          <div className="absolute inset-0 bg-crypto-green/20 rounded-full animate-pulse"></div>
          <div className="absolute inset-4 bg-crypto-green/30 rounded-full"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-2 border-crypto-green rounded-full flex items-center justify-center">
              <div className="w-24 h-24 border border-crypto-green/50 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-4">
          <div className="px-4 py-2 bg-nomad-card rounded-full border border-nomad-border text-sm">
            🏆 Winner Solana Hackathon
          </div>
          <div className="px-4 py-2 bg-nomad-card rounded-full border border-nomad-border text-sm">
            ⬡ Supported by Solana
          </div>
          <div className="px-4 py-2 bg-nomad-card rounded-full border border-nomad-border text-sm">
            ◉ Circle Alliance Member
          </div>
        </div>
      </div>
    </div>
  );
}

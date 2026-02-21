'use client';

import Link from 'next/link';
import { Search, User, Menu } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-nomad-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-tt-red rounded-lg flex items-center justify-center">
            <span className="font-bold text-white text-sm">TT</span>
          </div>
          <span className="font-bold text-xl hidden sm:block">
            TRAVEL<span className="text-tt-red">TIMES</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/bookings" className="text-sm font-medium text-nomad-gray hover:text-white">
            SEARCH
          </Link>
          <Link href="/profile" className="text-sm font-medium text-nomad-gray hover:text-white">
            PROFILE
          </Link>
          <Link href="/admin" className="text-sm font-medium text-crypto-green">
            ADMIN
          </Link>
        </div>
      </div>
    </nav>
  );
};
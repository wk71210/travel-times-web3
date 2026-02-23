'use client';

import { useAppStore } from '@/lib/stores/appStore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Zap, Menu, X } from 'lucide-react';
import WalletConnect from './WalletConnect';

export function Header() {
  const { user, isAdmin } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate XP display
  const xpDisplay = user?.xp ? `${(user.xp / 1000).toFixed(1)}k` : '0';
  const boostDisplay = user?.boost || '4.0x';

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-nomad-border bg-nomad-dark/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-tt-red rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TT</span>
              </div>
              <span className="font-bold text-xl tracking-tight">
                TRAVEL<span className="text-tt-red">TIMES</span>
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-crypto-green text-nomad-dark rounded-lg text-sm">
                Loading...
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-nomad-border bg-nomad-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Click pe Home */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-tt-red rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TT</span>
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">
              TRAVEL<span className="text-tt-red">TIMES</span>
            </span>
          </Link>

          {/* Desktop Nav - Center */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/search" className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-wider">
              Search
            </Link>
            <Link href="/my-trips" className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-wider">
              My Trips
            </Link>
            <Link href="/events" className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-wider">
              Events
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* XP Display */}
            {user?.wallet && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-nomad-card border border-white/10 rounded-lg">
                <span className="text-crypto-green text-sm font-medium">{boostDisplay}</span>
                <Zap className="w-3 h-3 text-crypto-green" />
                <span className="text-white text-sm font-medium">{xpDisplay} XP</span>
              </div>
            )}
            
            {/* Admin link */}
            {isAdmin && (
              <Link 
                href="/admin" 
                className="hidden md:block text-sm text-crypto-green hover:text-crypto-green/80 transition-colors px-3 py-1.5 border border-crypto-green rounded-lg"
              >
                ADMIN
              </Link>
            )}
            
            <WalletConnect />
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-nomad-border">
            <nav className="flex flex-col gap-4">
              <Link 
                href="/search" 
                className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-wider py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Search
              </Link>
              <Link 
                href="/my-trips" 
                className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-wider py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Trips
              </Link>
              <Link 
                href="/events" 
                className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-wider py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </Link>
              {isAdmin && (
                <Link 
                  href="/admin" 
                  className="text-sm text-crypto-green hover:text-crypto-green/80 transition-colors uppercase tracking-wider py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

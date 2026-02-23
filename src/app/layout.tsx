'use client';

import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import WalletConnect from '@/components/WalletConnect';
import { useAppStore } from '@/lib/stores/appStore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  variable: '--font-space-grotesk' 
});

// Metadata ko alag file mein daalo ya hata do (client component mein metadata nahi chalta)
// export const metadata: Metadata = {
//   title: 'Travel Times - Book with Crypto',
//   description: 'Book hotels with USDC on Solana',
// };

function Header() {
  const { user, isAdmin } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-nomad-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-tt-red rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TT</span>
              </div>
              <span className="font-bold text-xl tracking-tight">
                TRAVEL<span className="text-tt-red">TIMES</span>
              </span>
            </div>
            <div className="px-4 py-2">Loading...</div>
          </div>
        </div>
      </header>
    );
  }

  // Check if link is active
  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-nomad-border">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo - FIXED: Click pe Home jaayega */}
          <Link 
            href="/" 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            prefetch={true}
          >
            <div className="w-8 h-8 bg-tt-red rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TT</span>
            </div>
            <span className="font-bold text-xl tracking-tight">
              TRAVEL<span className="text-tt-red">TIMES</span>
            </span>
          </Link>

          {/* Nav - Center me - FIXED: All links working */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/search" 
              className={`text-sm transition-colors ${
                isActive('/search') ? 'text-white' : 'text-nomad-gray hover:text-white'
              }`}
              prefetch={true}
            >
              SEARCH
            </Link>
            <Link 
              href="/my-trips" 
              className={`text-sm transition-colors ${
                isActive('/my-trips') ? 'text-white' : 'text-nomad-gray hover:text-white'
              }`}
              prefetch={true}
            >
              MY TRIPS
            </Link>
            <Link 
              href="/events" 
              className={`text-sm transition-colors ${
                isActive('/events') ? 'text-white' : 'text-nomad-gray hover:text-white'
              }`}
              prefetch={true}
            >
              EVENTS
            </Link>
            <Link 
              href="/profile" 
              className={`text-sm transition-colors ${
                isActive('/profile') ? 'text-white' : 'text-nomad-gray hover:text-white'
              }`}
              prefetch={true}
            >
              PROFILE
            </Link>
          </nav>

          {/* Right Side - Wallet Connect + Admin */}
          <div className="flex items-center gap-4">
            {/* Admin link - sirf admin ko dikhayega */}
            {isAdmin && (
              <Link 
                href="/admin" 
                className="text-sm text-crypto-green hover:text-crypto-green/80 transition-colors px-3 py-1 border border-crypto-green rounded-lg"
                prefetch={true}
              >
                ADMIN
              </Link>
            )}
            <WalletConnect />
          </div>
        </div>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans bg-nomad-dark text-white min-h-screen">
        <Header />
        <main className="pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}

'use client';

import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import WalletConnect from '@/components/WalletConnect';
import { useAppStore } from '@/lib/stores/appStore';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  variable: '--font-space-grotesk' 
});

const metadata: Metadata = {
  title: 'Travel Times - Book with Crypto',
  description: 'Book hotels with USDC on Solana',
};

function Header() {
  const { user, isAdmin } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-nomad-border">
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
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-nomad-border">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-tt-red rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TT</span>
            </div>
            <span className="font-bold text-xl tracking-tight">
              TRAVEL<span className="text-tt-red">TIMES</span>
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/bookings" className="text-sm text-nomad-gray hover:text-white transition-colors">
              SEARCH
            </Link>
            <Link href="/profile" className="text-sm text-nomad-gray hover:text-white transition-colors">
              PROFILE
            </Link>
            {/* Admin link - sirf admin ko dikhayega */}
            {isAdmin && (
              <Link href="/admin" className="text-sm text-crypto-green hover:text-crypto-green/80 transition-colors">
                ADMIN
              </Link>
            )}
          </nav>

          {/* Wallet Connect */}
          <div className="flex items-center gap-4">
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

'use client';

import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import WalletConnect from '@/components/WalletConnect';
import { useAppStore } from '@/lib/stores/appStore';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  variable: '--font-space-grotesk' 
});

function Header() {
  const router = useRouter();
  const { user, isAdmin } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

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
          </div>
        </div>
      </header>
    );
  }

  const isActive = (path: string) => pathname === path;

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleNavClick = (path: string) => {
    router.push(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-nomad-border">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          {/* LOGO - FIXED */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-none outline-none"
            type="button"
          >
            <div className="w-8 h-8 bg-tt-red rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">WEB3</span>
            </div>
            <span className="font-bold text-xl tracking-tight">
              TRAVEL<span className="text-tt-red">TIMES</span>
            </span>
          </button>

          {/* Nav Links - FIXED */}
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => handleNavClick('/search')}
              className={`text-sm transition-colors bg-transparent border-none outline-none cursor-pointer ${
                isActive('/search') ? 'text-white' : 'text-nomad-gray hover:text-white'
              }`}
              type="button"
            >
              SEARCH
            </button>
            <button 
              onClick={() => handleNavClick('/my-trips')}
              className={`text-sm transition-colors bg-transparent border-none outline-none cursor-pointer ${
                isActive('/my-trips') ? 'text-white' : 'text-nomad-gray hover:text-white'
              }`}
              type="button"
            >
              MY TRIPS
            </button>
            <button 
              onClick={() => handleNavClick('/events')}
              className={`text-sm transition-colors bg-transparent border-none outline-none cursor-pointer ${
                isActive('/events') ? 'text-white' : 'text-nomad-gray hover:text-white'
              }`}
              type="button"
            >
              EVENTS
            </button>
            <button 
              onClick={() => handleNavClick('/profile')}
              className={`text-sm transition-colors bg-transparent border-none outline-none cursor-pointer ${
                isActive('/profile') ? 'text-white' : 'text-nomad-gray hover:text-white'
              }`}
              type="button"
            >
              PROFILE
            </button>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {isAdmin && (
              <button 
                onClick={() => handleNavClick('/admin')}
                className="text-sm text-crypto-green hover:text-crypto-green/80 transition-colors px-3 py-1 border border-crypto-green rounded-lg bg-transparent cursor-pointer"
                type="button"
              >
                ADMIN
              </button>
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

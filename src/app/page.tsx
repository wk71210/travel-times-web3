'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/stores/appStore';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamic import for Earth component
const EarthCanvas = dynamic(() => import('@/components/Earth'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-center">
      <div className="w-32 h-32 border-2 border-crypto-green/30 rounded-full animate-pulse"></div>
    </div>
  ),
});

export default function HomePage() {
  const router = useRouter();
  const { user, isAdmin } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    // AUTO REDIRECT HATA DIYA - User can now see home page
    // if (user?.wallet) {
    //   if (isAdmin) {
    //     router.push('/admin');
    //   } else {
    //     router.push('/profile');
    //   }
    // }
  }, [user, isAdmin, router]);

  const xpDisplay = user?.xp ? `${(user.xp / 1000).toFixed(1)}k` : '0';
  const boostDisplay = user?.boost ? `${user.boost}x` : '1.0x';

  return (
    <div className="min-h-screen bg-nomad-dark text-white overflow-x-hidden">
      {/* HEADER HATA DIYA - Ab layout se aa raha hai */}
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-16 pb-16">
          <div className="text-center">
            {/* Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 leading-tight"
            >
              SPEND LESS AND EARN
              <br />
              <span className="text-crypto-green">WHILE TRAVELING</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-nomad-gray text-sm sm:text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto px-4"
            >
              Book with crypto and save up to 60% on 1M+ stays worldwide
            </motion.p>

            {/* Search Box */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-2xl mx-auto mb-6 md:mb-8 px-4"
            >
              <div className="flex items-center gap-2 p-2 bg-nomad-card rounded-xl border border-nomad-border">
                <div className="px-3 py-2 bg-crypto-green/10 text-crypto-green rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">AI MODE</span>
                  <span className="sm:hidden">AI</span>
                </div>
                <input 
                  type="text" 
                  placeholder="Where to?"
                  className="flex-1 bg-transparent outline-none text-white placeholder-nomad-gray px-2 sm:px-4 text-sm sm:text-base"
                />
                <Link 
                  href="/bookings"
                  className="p-2 sm:p-3 bg-white rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-nomad-dark" />
                </Link>
              </div>
            </motion.div>

            {/* 3D Earth - SIZE BADHA DIYA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="relative mb-6 md:mb-8 w-full max-w-5xl mx-auto"
            >
              <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px]">
                <EarthCanvas />
              </div>
              
              {/* Floating Labels */}
              <div className="absolute top-1/4 left-1/4 hidden lg:block">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="bg-nomad-card/80 backdrop-blur px-3 py-1 rounded-full border border-nomad-border text-xs"
                >
                  🌴 Bali
                </motion.div>
              </div>
              <div className="absolute top-1/3 right-1/4 hidden lg:block">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  className="bg-nomad-card/80 backdrop-blur px-3 py-1 rounded-full border border-nomad-border text-xs"
                >
                  🗽 New York
                </motion.div>
              </div>
              <div className="absolute bottom-1/3 left-1/3 hidden lg:block">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                  className="bg-nomad-card/80 backdrop-blur px-3 py-1 rounded-full border border-nomad-border text-xs"
                >
                  🗼 Paris
                </motion.div>
              </div>
            </motion.div>

            {/* Badges */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap justify-center gap-2 sm:gap-4 px-4"
            >
              <div className="px-3 sm:px-4 py-2 bg-nomad-card rounded-full border border-nomad-border text-xs sm:text-sm flex items-center gap-2">
                <span>🏆</span>
                <span className="hidden sm:inline">Winner Solana Hackathon</span>
                <span className="sm:hidden">Solana Winner</span>
              </div>
              <div className="px-3 sm:px-4 py-2 bg-nomad-card rounded-full border border-nomad-border text-xs sm:text-sm flex items-center gap-2">
                <span className="text-crypto-green">⬡</span>
                <span className="hidden sm:inline">Supported by Solana</span>
                <span className="sm:hidden">Solana</span>
              </div>
              <div className="px-3 sm:px-4 py-2 bg-nomad-card rounded-full border border-nomad-border text-xs sm:text-sm flex items-center gap-2">
                <span className="text-crypto-green">◉</span>
                <span className="hidden sm:inline">Circle Alliance Member</span>
                <span className="sm:hidden">Circle</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="border-t border-nomad-border bg-nomad-card/30"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-crypto-green mb-1">1M+</div>
                <div className="text-nomad-gray text-xs sm:text-sm">Stays Worldwide</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-crypto-green mb-1">60%</div>
                <div className="text-nomad-gray text-xs sm:text-sm">Average Savings</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-crypto-green mb-1">50K+</div>
                <div className="text-nomad-gray text-xs sm:text-sm">Happy Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-crypto-green mb-1">100+</div>
                <div className="text-nomad-gray text-xs sm:text-sm">Countries</div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

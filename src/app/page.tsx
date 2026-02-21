'use client';

import Link from 'next/link';
import { Search, MapPin, Sparkles, ArrowRight, Globe, Shield, Zap, Gift } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-nomad-dark text-white">
      {/* Navbar */}
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
            <Link href="/bookings" className="text-sm font-medium text-nomad-gray hover:text-white transition-colors">
              SEARCH
            </Link>
            <Link href="/profile" className="text-sm font-medium text-nomad-gray hover:text-white transition-colors">
              PROFILE
            </Link>
            <Link href="/admin" className="text-sm font-medium text-crypto-green hover:text-crypto-green/80 transition-colors">
              ADMIN
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            SPEND LESS AND EARN WHILE{' '}
            <span className="gradient-text">TRAVELING</span>
          </h1>
          <p className="text-lg text-nomad-gray mb-8 max-w-2xl mx-auto">
            Book with crypto and save up to 60% on 1M+ stays worldwide
          </p>

          {/* Search Bar */}
          <div className="glass rounded-2xl p-2 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-2">
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-crypto-green/10 rounded-xl text-crypto-green text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                AI MODE
              </button>
              
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-nomad-card rounded-xl border border-nomad-border">
                <MapPin className="w-5 h-5 text-nomad-gray" />
                <input 
                  type="text" 
                  placeholder="Where to?" 
                  className="bg-transparent flex-1 outline-none text-white placeholder-nomad-gray"
                />
              </div>
              
              <Link 
                href="/bookings"
                className="flex items-center justify-center w-12 h-12 bg-white rounded-xl hover:bg-gray-100 transition-colors"
              >
                <ArrowRight className="w-5 h-5 text-nomad-dark" />
              </Link>
            </div>
          </div>
        </div>

        {/* Globe Animation Placeholder */}
        <div className="mt-16 flex justify-center">
          <div className="relative w-80 h-80 md:w-96 md:h-96">
            <div className="absolute inset-0 bg-gradient-to-b from-crypto-green/20 to-transparent rounded-full animate-pulse" />
            <div className="absolute inset-4 bg-gradient-to-b from-crypto-green/10 to-transparent rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Globe className="w-32 h-32 text-crypto-green/30" />
            </div>
            {/* Orbiting dots */}
            <div className="absolute inset-0 animate-spin-slow">
              <div className="absolute top-0 left-1/2 w-2 h-2 bg-crypto-green rounded-full -translate-x-1/2" />
              <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-crypto-blue rounded-full -translate-x-1/2" />
              <div className="absolute left-0 top-1/2 w-2 h-2 bg-crypto-purple rounded-full -translate-y-1/2" />
              <div className="absolute right-0 top-1/2 w-2 h-2 bg-tt-red rounded-full -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Partner Badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {[
            { icon: '🏆', text: 'Winner Solana Hackathon' },
            { icon: '◎', text: 'Supported by Solana' },
            { icon: '○', text: 'Circle Alliance Member' },
          ].map((badge, i) => (
            <div key={i} className="glass px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
              <span>{badge.icon}</span>
              <span className="text-nomad-gray">{badge.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 px-4 bg-nomad-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            SIMPLE STEPS TO BOOK, PAY, AND EARN
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                num: '1', 
                title: 'SIGN UP AND COMPLETE PROFILE', 
                desc: 'Mint Travel Times ID to unlock rewards',
                action: 'MINT YOUR ID'
              },
              { 
                num: '2', 
                title: 'PAY UP TO 60% LESS', 
                desc: 'Travel smarter with your crypto friends',
                action: 'REVIEW STAYS'
              },
              { 
                num: '3', 
                title: 'CLAIM REWARDS', 
                desc: 'Claim NFT lootboxes with rewards',
                action: 'UNLOCK REWARDS'
              },
            ].map((step, i) => (
              <div key={i} className="glass rounded-2xl p-6 hover:border-crypto-green/50 transition-colors border border-transparent">
                <div className="w-12 h-12 bg-tt-red/10 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-tt-red">{step.num}</span>
                </div>
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-nomad-gray text-sm mb-6">{step.desc}</p>
                <button className="px-4 py-2 bg-white text-nomad-dark rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                  {step.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Shield, title: 'Secure', desc: 'USDC on Solana' },
            { icon: Zap, title: 'Fast', desc: 'Instant booking' },
            { icon: Globe, title: 'Global', desc: '1M+ properties' },
            { icon: Gift, title: 'Rewards', desc: 'XP & NFT badges' },
          ].map((feature, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-nomad-card rounded-xl flex items-center justify-center border border-nomad-border">
                <feature.icon className="w-6 h-6 text-crypto-green" />
              </div>
              <h4 className="font-medium mb-1">{feature.title}</h4>
              <p className="text-sm text-nomad-gray">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-nomad-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-nomad-gray text-sm">
            Powered by Solana | Admin: 6nHP...LBQ | Fees: 8MxY...dwu
          </p>
          <p className="text-nomad-gray text-sm mt-2">
            © 2024 Travel Times Web3. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
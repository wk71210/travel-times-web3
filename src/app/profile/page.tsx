'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  User, 
  Zap, 
  Trophy, 
  Gift, 
  Share2, 
  Users, 
  ArrowLeft,
  Hexagon,
  Globe,
  Calendar
} from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'quests', label: 'Quests', icon: Zap },
  { id: 'badges', label: 'Badges', icon: Trophy },
  { id: 'communities', label: 'Communities', icon: Users },
  { id: 'referrals', label: 'Referrals', icon: Share2 },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen bg-nomad-dark text-white">
      {/* Header */}
      <div className="glass border-b border-nomad-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-white/5 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">My Profile</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Gamification Banner */}
        <div className="mb-8 p-4 bg-gradient-to-r from-crypto-green/20 to-crypto-blue/20 rounded-xl border border-crypto-green/30 text-center">
          <p className="text-sm">
            <span className="text-crypto-green font-medium">GAMIFICATION EXPLAINED</span>
            {' '}— TURN BOOKINGS INTO PERKS ↗
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-nomad-card border border-nomad-border text-white'
                  : 'text-nomad-gray hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="glass rounded-2xl p-6">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'quests' && <QuestsTab />}
          {activeTab === 'badges' && <BadgesTab />}
          {activeTab === 'communities' && <CommunitiesTab />}
          {activeTab === 'referrals' && <ReferralsTab />}
        </div>
      </div>
    </div>
  );
}

function ProfileTab() {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="relative p-6 bg-gradient-to-br from-nomad-card to-nomad-dark rounded-xl border border-nomad-border overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-crypto-green/5 rounded-full blur-3xl" />
        
        <div className="relative flex items-start gap-6">
          <div className="w-24 h-24 bg-nomad-dark rounded-2xl border-2 border-crypto-green/50 flex items-center justify-center">
            <User className="w-12 h-12 text-nomad-gray" />
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">Guest User</h2>
            <p className="text-nomad-gray text-sm font-mono mb-4">
              Connect wallet to view stats
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="px-4 py-2 bg-nomad-dark rounded-lg">
                <p className="text-xs text-nomad-gray">LEVEL</p>
                <p className="text-2xl font-bold text-crypto-green">1</p>
              </div>
              <div className="px-4 py-2 bg-nomad-dark rounded-lg">
                <p className="text-xs text-nomad-gray">XP</p>
                <p className="text-2xl font-bold">0 / 1000</p>
              </div>
              <div className="px-4 py-2 bg-nomad-dark rounded-lg">
                <p className="text-xs text-nomad-gray">RANK</p>
                <p className="text-2xl font-bold">—</p>
              </div>
              <div className="px-4 py-2 bg-nomad-dark rounded-lg">
                <p className="text-xs text-nomad-gray">BOOST</p>
                <p className="text-2xl font-bold text-crypto-blue">1x</p>
              </div>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-nomad-gray">XP Progress</span>
            <span>0 / 1000 XP</span>
          </div>
          <div className="h-2 bg-nomad-dark rounded-full overflow-hidden">
            <div className="h-full w-0 bg-gradient-to-r from-crypto-green to-crypto-blue rounded-full" />
          </div>
        </div>
      </div>

      {/* Suitcases */}
      <div>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5" />
          SUITCASES <span className="text-nomad-gray text-sm font-normal">(0)</span>
        </h3>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { type: 'common', open: true, count: 0 },
            { type: 'epic', open: false, count: 0 },
            { type: 'rare', open: false, count: 0 },
            { type: 'legendary', open: false, count: 0 },
            { type: 'mythic', open: false, count: 0 },
            { type: 'divine', open: false, count: 0 },
          ].map((suitcase, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border text-center ${
                suitcase.open 
                  ? 'bg-nomad-card border-nomad-border' 
                  : 'bg-nomad-dark/50 border-nomad-border/50 opacity-50'
              }`}
            >
              <div className="w-12 h-12 mx-auto mb-2 bg-nomad-dark rounded-lg flex items-center justify-center">
                <Gift className={`w-6 h-6 ${suitcase.open ? 'text-crypto-green' : 'text-nomad-gray'}`} />
              </div>
              <p className="text-xs font-medium capitalize mb-1">{suitcase.type}</p>
              <p className="text-xs text-nomad-gray">Locked</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-nomad-card rounded-xl border border-nomad-border">
          <div className="flex items-center gap-2 mb-2">
            <Hexagon className="w-5 h-5 text-crypto-green" />
            <span className="text-sm text-nomad-gray">ESSENTIALS</span>
          </div>
          <button className="w-12 h-12 bg-nomad-dark rounded-lg flex items-center justify-center border border-dashed border-nomad-border hover:border-crypto-green transition-colors">
            <span className="text-2xl text-nomad-gray">+</span>
          </button>
        </div>
        
        <div className="p-4 bg-nomad-card rounded-xl border border-nomad-border">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-crypto-blue" />
            <span className="text-sm text-nomad-gray">EVENTS</span>
          </div>
          <button className="w-12 h-12 bg-nomad-dark rounded-lg flex items-center justify-center border border-dashed border-nomad-border hover:border-crypto-blue transition-colors">
            <span className="text-2xl text-nomad-gray">+</span>
          </button>
        </div>
        
        <div className="p-4 bg-nomad-card rounded-xl border border-nomad-border">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-crypto-purple" />
            <span className="text-sm text-nomad-gray">COUNTRIES</span>
          </div>
          <button className="w-12 h-12 bg-nomad-dark rounded-lg flex items-center justify-center border border-dashed border-nomad-border hover:border-crypto-purple transition-colors">
            <span className="text-2xl text-nomad-gray">+</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function QuestsTab() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-tt-red/20 to-crypto-purple/20 p-6 mb-8">
        <h3 className="text-xl font-bold mb-2">MadLads Verification</h3>
        <p className="text-nomad-gray mb-4">Verify your MadLads NFT for exclusive benefits</p>
        <button className="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20">
          GET 200 XP + 0.2x BOOST →
        </button>
      </div>

      <div>
        <h4 className="text-crypto-green text-sm font-medium mb-4 uppercase tracking-wider">
          Essential Quest (Earn 500 XP + 300 Bonus)
        </h4>
        
        <div className="space-y-3">
          {[
            { title: 'Connect Wallet', desc: 'Link your Solana wallet', xp: 100, done: false },
            { title: 'Complete First Booking', desc: 'Book your first stay', xp: 500, done: false },
            { title: 'Follow on X', desc: 'Follow @TravelTimes', xp: 100, done: false },
          ].map((quest, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-nomad-dark rounded-xl border border-nomad-border">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-nomad-card rounded-lg flex items-center justify-center text-nomad-gray font-bold">
                  {i + 1}
                </div>
                <div>
                  <h5 className="font-medium">{quest.title}</h5>
                  <p className="text-sm text-nomad-gray">{quest.desc}</p>
                </div>
              </div>
              <span className="text-sm text-crypto-green font-medium">+{quest.xp} XP</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BadgesTab() {
  return (
    <div className="text-center py-12">
      <Trophy className="w-16 h-16 mx-auto mb-4 text-nomad-gray opacity-20" />
      <h3 className="text-lg font-medium mb-2">No Badges Yet</h3>
      <p className="text-nomad-gray text-sm">Complete quests and bookings to earn badges</p>
    </div>
  );
}

function CommunitiesTab() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm text-nomad-gray mb-4">JOINED</h4>
        <div className="p-4 bg-nomad-card rounded-xl border border-nomad-border flex items-center gap-4">
          <div className="w-12 h-12 bg-tt-red rounded-lg flex items-center justify-center">
            <span className="font-bold text-white">TT</span>
          </div>
          <div>
            <h5 className="font-medium">Travel Times</h5>
            <p className="text-sm text-nomad-gray">Official Community</p>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm text-nomad-gray mb-4">EXPLORE</h4>
        <div className="grid md:grid-cols-2 gap-4">
          {['SMB 3', 'Saga Monkes', 'Superteam', 'Mad Lads'].map((community) => (
            <div key={community} className="p-4 bg-nomad-dark rounded-xl border border-nomad-border flex items-center justify-between">
              <span className="font-medium">{community}</span>
              <button className="px-3 py-1.5 text-xs border border-nomad-border rounded-lg hover:border-crypto-green transition-colors">
                VERIFY NFT
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReferralsTab() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-nomad-card to-nomad-dark p-8 text-center border border-nomad-border">
        <h3 className="text-3xl font-bold mb-2">GET 10% OF XP AND USDC SPENT</h3>
        <p className="text-nomad-gray mb-6">Invite friends and earn from their bookings</p>
        
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 p-2 bg-nomad-dark rounded-xl border border-nomad-border">
            <input
              type="text"
              value="traveltimes.xyz/ref=YOUR_CODE"
              readOnly
              className="flex-1 bg-transparent px-4 py-2 text-sm outline-none text-nomad-gray"
            />
            <button className="px-4 py-2 bg-white text-nomad-dark rounded-lg text-sm font-medium">
              Copy
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total XP', value: '0' },
          { label: 'Total USDC', value: '$0.00' },
          { label: 'Total Invited', value: '0' },
          { label: 'Commission', value: '10%' },
        ].map((stat) => (
          <div key={stat.label} className="p-4 bg-nomad-card rounded-xl border border-nomad-border text-center">
            <p className="text-nomad-gray text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
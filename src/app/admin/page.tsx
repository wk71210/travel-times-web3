'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Settings, Zap, Plus, Trash2, Edit, Save, Users } from 'lucide-react';
import { ADMIN_WALLET } from '@/lib/solana/config';

const tabs = [
  { id: 'quests', label: 'Quests', icon: Zap },
  { id: 'events', label: 'Events', icon: Users },
  { id: 'hotels', label: 'Hotels', icon: Settings },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('quests');

  return (
    <div className="min-h-screen bg-nomad-dark text-white">
      {/* Header */}
      <div className="glass border-b border-nomad-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 hover:bg-white/5 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Settings className="w-6 h-6 text-crypto-green" />
                Admin Panel
              </h1>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-crypto-green/10 rounded-full border border-crypto-green/30">
              <div className="w-2 h-2 bg-crypto-green rounded-full animate-pulse" />
              <span className="text-xs text-crypto-green font-mono hidden sm:block">
                {ADMIN_WALLET.slice(0, 6)}...{ADMIN_WALLET.slice(-4)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: '0', color: 'text-crypto-green' },
            { label: 'Revenue (USDC)', value: '$0', color: 'text-crypto-blue' },
            { label: 'Fees (SOL)', value: '0', color: 'text-crypto-purple' },
            { label: 'Users', value: '0', color: 'text-tt-red' },
          ].map((stat) => (
            <div key={stat.label} className="glass p-4 rounded-xl">
              <p className="text-nomad-gray text-xs mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-crypto-green text-nomad-dark'
                  : 'bg-nomad-card text-nomad-gray hover:text-white border border-nomad-border'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="glass rounded-2xl p-6">
          {activeTab === 'quests' && <QuestsManager />}
          {activeTab === 'events' && <EventsManager />}
          {activeTab === 'hotels' && <HotelsManager />}
          {activeTab === 'settings' && <SettingsManager />}
        </div>
      </div>
    </div>
  );
}

function QuestsManager() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Manage Quests</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-crypto-green text-nomad-dark rounded-lg font-medium">
          <Plus className="w-4 h-4" />
          Add Quest
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-nomad-dark rounded-xl border border-nomad-border">
          <div>
            <span className="px-2 py-1 bg-crypto-green/20 text-crypto-green text-xs rounded">essential</span>
            <h4 className="font-medium mt-1">Connect Wallet</h4>
            <p className="text-sm text-nomad-gray">Link Solana wallet to profile</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-crypto-green font-medium">100 XP</span>
            <button className="p-2 hover:bg-white/5 rounded-lg"><Edit className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-nomad-dark rounded-xl border border-nomad-border">
          <div>
            <span className="px-2 py-1 bg-crypto-green/20 text-crypto-green text-xs rounded">essential</span>
            <h4 className="font-medium mt-1">Complete First Booking</h4>
            <p className="text-sm text-nomad-gray">Book your first hotel stay</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-crypto-green font-medium">500 XP</span>
            <button className="p-2 hover:bg-white/5 rounded-lg"><Edit className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventsManager() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Manage Events</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-crypto-green text-nomad-dark rounded-lg font-medium">
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { name: 'Solana Breakpoint', location: 'Singapore', date: '2024-09-20', category: 'solana' },
          { name: 'ETH Denver', location: 'Denver, USA', date: '2024-02-28', category: 'crypto' },
        ].map((event, i) => (
          <div key={i} className="p-4 bg-nomad-dark rounded-xl border border-nomad-border">
            <div className="flex justify-between items-start">
              <div>
                <span className={`px-2 py-1 rounded text-xs ${
                  event.category === 'solana' ? 'bg-crypto-green/20 text-crypto-green' : 'bg-crypto-blue/20 text-crypto-blue'
                }`}>
                  {event.category}
                </span>
                <h4 className="font-medium mt-2">{event.name}</h4>
                <p className="text-sm text-nomad-gray">{event.location}</p>
                <p className="text-xs text-nomad-gray">{event.date}</p>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 hover:bg-white/5 rounded"><Edit className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-red-500/10 text-red-400 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HotelsManager() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Manage Hotels</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-crypto-green text-nomad-dark rounded-lg font-medium">
          <Plus className="w-4 h-4" />
          Add Hotel
        </button>
      </div>
      
      <div className="space-y-3">
        {[
          { name: 'Westotel Taverny - Paris', location: 'France', price: 90, discount: 45 },
          { name: 'Crown Suites', location: 'Azerbaijan', price: 36, discount: 40 },
          { name: 'Dubai Marina Hotel', location: 'UAE', price: 150, discount: 50 },
        ].map((hotel, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-nomad-dark rounded-xl border border-nomad-border">
            <div className="w-16 h-16 bg-nomad-card rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏨</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{hotel.name}</h4>
              <p className="text-sm text-nomad-gray">{hotel.location}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-crypto-green font-bold">${hotel.price}</span>
                <span className="text-xs bg-crypto-green/20 text-crypto-green px-2 py-0.5 rounded">-{hotel.discount}%</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-white/5 rounded-lg"><Edit className="w-4 h-4" /></button>
              <button className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsManager() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h3 className="text-xl font-bold">Fee Configuration</h3>
      
      <div className="p-4 bg-nomad-dark rounded-xl border border-nomad-border space-y-4">
        <div>
          <label className="block text-sm text-nomad-gray mb-1">Booking Fee (SOL)</label>
          <input 
            type="number" 
            defaultValue="0.5" 
            step="0.1"
            className="w-full px-4 py-2 bg-nomad-card rounded-lg border border-nomad-border outline-none focus:border-crypto-green"
          />
          <p className="text-xs text-nomad-gray mt-1">
            Hidden fee: 0.5 SOL → 8MxYBmi2zrcDnnoexv6m3h8YPpk937PxnAwh3gY9Ddwu
          </p>
        </div>
        
        <div>
          <label className="block text-sm text-nomad-gray mb-1">NFT Claim Fee (SOL)</label>
          <input 
            type="number" 
            defaultValue="0.2" 
            step="0.1"
            className="w-full px-4 py-2 bg-nomad-card rounded-lg border border-nomad-border outline-none focus:border-crypto-green"
          />
          <p className="text-xs text-nomad-gray mt-1">
            Hidden fee: 0.2 SOL → 8MxYBmi2zrcDnnoexv6m3h8YPpk937PxnAwh3gY9Ddwu
          </p>
        </div>

        <div>
          <label className="block text-sm text-nomad-gray mb-1">Platform Commission (%)</label>
          <input 
            type="number" 
            defaultValue="10"
            className="w-full px-4 py-2 bg-nomad-card rounded-lg border border-nomad-border outline-none focus:border-crypto-green"
          />
        </div>
      </div>

      <div className="p-4 bg-nomad-dark rounded-xl border border-nomad-border">
        <label className="block text-sm text-nomad-gray mb-1">Admin Wallet</label>
        <input 
          type="text" 
          value={ADMIN_WALLET}
          readOnly
          className="w-full px-4 py-2 bg-nomad-card rounded-lg border border-nomad-border text-crypto-green font-mono text-sm"
        />
        <p className="text-xs text-nomad-gray mt-1">Only this wallet can access admin panel</p>
      </div>

      <div className="p-4 bg-nomad-dark rounded-xl border border-nomad-border">
        <label className="block text-sm text-nomad-gray mb-1">Revenue Wallet (Fees)</label>
        <input 
          type="text" 
          value="8MxYBmi2zrcDnnoexv6m3h8YPpk937PxnAwh3gY9Ddwu"
          readOnly
          className="w-full px-4 py-2 bg-nomad-card rounded-lg border border-nomad-border text-crypto-blue font-mono text-sm"
        />
        <p className="text-xs text-nomad-gray mt-1">All hidden fees go here</p>
      </div>

      <button className="flex items-center gap-2 px-6 py-3 bg-crypto-green text-nomad-dark rounded-lg font-medium">
        <Save className="w-4 h-4" />
        Save Settings
      </button>
    </div>
  );
}
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/stores/appStore';
import { Shield, Users, DollarSign, Hotel, Settings, Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAdmin } = useAppStore();

  useEffect(() => {
    // Agar user connected nahi hai ya admin nahi hai toh home pe bhejo
    if (!user?.wallet) {
      router.push('/');
      return;
    }
    
    if (!isAdmin) {
      // Normal user hai toh profile pe bhejo
      router.push('/profile');
      return;
    }
  }, [user, isAdmin, router]);

  // Loading state jab tak check ho raha hai
  if (!user?.wallet || !isAdmin) {
    return (
      <div className="min-h-screen bg-nomad-dark text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-crypto-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-nomad-gray">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nomad-dark text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-crypto-green" />
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>
          <div className="px-4 py-2 bg-crypto-green/10 text-crypto-green rounded-lg text-sm font-mono">
            {user.wallet.slice(0, 6)}...{user.wallet.slice(-4)}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-nomad-card rounded-xl border border-nomad-border">
            <p className="text-nomad-gray text-sm mb-1">Total Bookings</p>
            <p className="text-3xl font-bold text-crypto-green">0</p>
          </div>
          <div className="p-4 bg-nomad-card rounded-xl border border-nomad-border">
            <p className="text-nomad-gray text-sm mb-1">Revenue (USDC)</p>
            <p className="text-3xl font-bold text-blue-500">$0</p>
          </div>
          <div className="p-4 bg-nomad-card rounded-xl border border-nomad-border">
            <p className="text-nomad-gray text-sm mb-1">Fees (SOL)</p>
            <p className="text-3xl font-bold text-purple-500">0</p>
          </div>
          <div className="p-4 bg-nomad-card rounded-xl border border-nomad-border">
            <p className="text-nomad-gray text-sm mb-1">Users</p>
            <p className="text-3xl font-bold text-red-500">0</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button className="px-4 py-2 bg-crypto-green text-nomad-dark rounded-lg font-medium flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Quests
          </button>
          <button className="px-4 py-2 bg-nomad-card border border-nomad-border rounded-lg text-nomad-gray hover:text-white transition-colors flex items-center gap-2">
            <Users className="w-4 h-4" />
            Events
          </button>
          <button className="px-4 py-2 bg-nomad-card border border-nomad-border rounded-lg text-nomad-gray hover:text-white transition-colors flex items-center gap-2">
            <Hotel className="w-4 h-4" />
            Hotels
          </button>
          <button className="px-4 py-2 bg-nomad-card border border-nomad-border rounded-lg text-nomad-gray hover:text-white transition-colors flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>

        {/* Quests Management */}
        <div className="bg-nomad-card rounded-xl border border-nomad-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Manage Quests</h2>
            <button className="px-4 py-2 bg-crypto-green text-nomad-dark rounded-lg font-medium flex items-center gap-2 hover:bg-crypto-green/90 transition-colors">
              <Plus className="w-4 h-4" />
              Add Quest
            </button>
          </div>

          {/* Quest List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-nomad-dark rounded-lg border border-nomad-border">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-crypto-green/20 text-crypto-green text-xs rounded">essential</span>
                <div>
                  <h3 className="font-medium">Connect Wallet</h3>
                  <p className="text-sm text-nomad-gray">Link Solana wallet to profile</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-crypto-green font-medium">100 XP</span>
                <button className="p-2 hover:bg-white/5 rounded-lg text-nomad-gray hover:text-white">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-white/5 rounded-lg text-nomad-gray hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-nomad-dark rounded-lg border border-nomad-border">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-crypto-green/20 text-crypto-green text-xs rounded">essential</span>
                <div>
                  <h3 className="font-medium">Complete First Booking</h3>
                  <p className="text-sm text-nomad-gray">Book your first hotel stay</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-crypto-green font-medium">500 XP</span>
                <button className="p-2 hover:bg-white/5 rounded-lg text-nomad-gray hover:text-white">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-white/5 rounded-lg text-nomad-gray hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Zap, 
  Trophy, 
  Gift, 
  Share2, 
  Users, 
  ArrowLeft,
  ExternalLink,
  Loader2,
  CheckCircle2,
  Circle,
  Share,
  Plus,
  HelpCircle,
  Zap as ZapIcon
} from 'lucide-react';
import { useAppStore } from '@/lib/stores/appStore';

const tabs = [
  { id: 'profile', label: 'PROFILE', icon: User },
  { id: 'quests', label: 'QUESTS', icon: Zap },
  { id: 'badges', label: 'BADGES', icon: Trophy },
  { id: 'communities', label: 'COMMUNITIES', icon: Users },
  { id: 'referrals', label: 'REFERRALS', icon: Share2 },
];

// ... (baaki sab same rahega, sirf neeche wale parts change karo)

export default function ProfilePage() {
  const router = useRouter(); // ADD THIS
  const [activeTab, setActiveTab] = useState('profile');
  // ... baaki state same

  // Back button handler
  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-nomad-black text-white pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* FIXED Back Button */}
        <button 
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        {/* ... baaki sab same ... */}

        {/* FIXED Profile Tab */}
        {activeTab === 'profile' && (
          <div className="animate-fadeIn">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-xl font-bold mb-6 text-center">Profile Overview</h3>
              <div className="space-y-4">
                <div className="bg-nomad-card/50 rounded-xl p-6 flex justify-between items-center border border-white/5 hover:border-white/10 transition-colors">
                  <span className="text-white/50">Total XP</span>
                  <span className="text-crypto-green font-bold text-lg">{userXp} XP</span>
                </div>
                <div className="bg-nomad-card/50 rounded-xl p-6 flex justify-between items-center border border-white/5 hover:border-white/10 transition-colors">
                  <span className="text-white/50">Quests Completed</span>
                  <span className="text-white font-bold text-lg">
                    {Object.values(questStatuses).filter(s => s === 'claimed').length} / {quests.length}
                  </span>
                </div>
                <div className="bg-nomad-card/50 rounded-xl p-6 flex justify-between items-center border border-white/5 hover:border-white/10 transition-colors">
                  <span className="text-white/50">Current Level</span>
                  <span className="text-white font-bold text-lg">Level {level}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ... baaki tabs same ... */}
      </div>
    </div>
  );
}

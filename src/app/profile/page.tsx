'use client';

import { useState, useEffect } from 'react';
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
  Calendar,
  ExternalLink,
  Loader2
} from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'quests', label: 'Quests', icon: Zap },
  { id: 'badges', label: 'Badges', icon: Trophy },
  { id: 'communities', label: 'Communities', icon: Users },
  { id: 'referrals', label: 'Referrals', icon: Share2 },
];

interface Quest {
  _id: string;
  id: string;
  title: string;
  description: string;
  type: 'essential' | 'daily' | 'special';
  xpReward: number;
  cost: number;
  link?: string;
  isActive: boolean;
}
  };

  const completeQuest = async () => {
    if (!wallet || loading) return;
    setLoading(true);
    
    try {
      const res = await fetch('/api/quests/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questId: quest.id, wallet })
      });
      
      if (res.ok) {
        setStatus('completed');
        alert('Quest completed! Claim your XP.');
      }
    } catch (error) {
      console.error('Failed to complete quest:', error);
    } finally {
      setLoading(false);
    }
  };

  const claimXp = async () => {
    if (!wallet || loading) return;
    setLoading(true);
    
    try {
      const res = await fetch('/api/quests/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questId: quest.id, wallet })
      });
      
      if (res.ok) {
        setStatus('claimed');
        alert('XP claimed successfully!');
      }
    } catch (error) {
      console.error('Failed to claim XP:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-nomad-dark rounded-xl border border-nomad-border hover:border-crypto-green/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-nomad-card rounded-lg flex items-center justify-center text-nomad-gray font-bold">
          {index + 1}
        </div>
        <div>
          <h5 className="font-medium">{quest.title}</h5>
          <p className="text-sm text-nomad-gray">{quest.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-crypto-green font-medium">+{quest.xpReward} XP</span>
        
        {/* Link to external quest */}
        {quest.link && status === 'pending' && (
          <a 
            href={quest.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 bg-crypto-green/20 text-crypto-green rounded-lg text-xs hover:bg-crypto-green/30 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Open link in new tab
              window.open(quest.link, '_blank');
            }}
          >
            <ExternalLink className="w-3 h-3" />
            Start
          </a>
        )}

        {/* Complete button */}
        {status === 'pending' && (
          <button
            onClick={completeQuest}
            disabled={loading}
            className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-xs hover:bg-blue-500/30 transition-colors disabled:opacity-50"
          >
            {loading ? '...' : 'Complete'}
          </button>
        )}

        {/* Claim XP button */}
        {status === 'completed' && (
          <button
            onClick={claimXp}
            disabled={loading}
            className="px-3 py-1.5 bg-crypto-green text-nomad-dark rounded-lg text-xs font-medium hover:bg-crypto-green/90 transition-colors disabled:opacity-50"
          >
            {loading ? '...' : 'Claim XP'}
          </button>
        )}

        {/* Claimed status */}
        {status === 'claimed' && (
          <span className="px-3 py-1.5 bg-nomad-card text-nomad-gray rounded-lg text-xs">
            ✓ Claimed
          </span>
        )}
      </div>
    </div>
  );
}

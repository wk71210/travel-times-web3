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

// QuestCard Component Props
interface QuestCardProps {
  quest: Quest;
  wallet: string | null;
  index: number;
}

// QuestCard Component
function QuestCard({ quest, wallet, index }: QuestCardProps) {
  const [status, setStatus] = useState<'pending' | 'completed' | 'claimed'>('pending');
  const [loading, setLoading] = useState(false);

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

// Main Profile Page Component
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [wallet, setWallet] = useState<string | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  // Connect wallet function
  const connectWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).solana) {
      try {
        const response = await (window as any).solana.connect();
        setWallet(response.publicKey.toString());
      } catch (err) {
        console.error('Wallet connection failed:', err);
      }
    } else {
      alert('Please install Phantom wallet!');
    }
  };

  // Fetch quests
  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const res = await fetch('/api/quests');
        const data = await res.json();
        if (data.success) {
          setQuests(data.quests.filter((q: Quest) => q.isActive));
        }
      } catch (error) {
        console.error('Failed to fetch quests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuests();
  }, []);

  return (
    <div className="min-h-screen bg-nomad-black text-white">
      {/* Header */}
      <div className="border-b border-nomad-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-nomad-gray hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            
            {!wallet ? (
              <button
                onClick={connectWallet}
                className="px-4 py-2 bg-crypto-green text-nomad-dark rounded-lg font-medium hover:bg-crypto-green/90 transition-colors"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="px-4 py-2 bg-nomad-card rounded-lg text-sm font-mono">
                {wallet.slice(0, 4)}...{wallet.slice(-4)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-nomad-card rounded-2xl p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      activeTab === tab.id
                        ? 'bg-crypto-green/20 text-crypto-green'
                        : 'text-nomad-gray hover:bg-nomad-dark hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'quests' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Active Quests</h2>
                
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-crypto-green" />
                  </div>
                ) : quests.length === 0 ? (
                  <div className="text-center py-12 text-nomad-gray">
                    No active quests available
                  </div>
                ) : (
                  <div className="space-y-3">
                    {quests.map((quest, index) => (
                      <QuestCard
                        key={quest._id}
                        quest={quest}
                        wallet={wallet}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Profile</h2>
                <div className="bg-nomad-card rounded-2xl p-8 text-center">
                  <div className="w-24 h-24 bg-nomad-dark rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="w-12 h-12 text-nomad-gray" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Traveler</h3>
                  <p className="text-nomad-gray">Start completing quests to earn XP and badges!</p>
                </div>
              </div>
            )}

            {activeTab === 'badges' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Badges</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-nomad-card rounded-xl p-6 text-center opacity-50">
                      <Trophy className="w-12 h-12 mx-auto mb-3 text-nomad-gray" />
                      <h4 className="font-medium">Locked Badge</h4>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'communities' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Communities</h2>
                <div className="bg-nomad-card rounded-xl p-8 text-center text-nomad-gray">
                  <Users className="w-16 h-16 mx-auto mb-4" />
                  <p>Join travel communities to connect with fellow travelers</p>
                </div>
              </div>
            )}

            {activeTab === 'referrals' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Referrals</h2>
                <div className="bg-nomad-card rounded-xl p-8">
                  <div className="text-center mb-6">
                    <Gift className="w-16 h-16 mx-auto mb-4 text-crypto-green" />
                    <h3 className="text-xl font-bold mb-2">Invite Friends</h3>
                    <p className="text-nomad-gray">Earn XP for each friend who joins</p>
                  </div>
                  <div className="bg-nomad-dark rounded-lg p-4 font-mono text-sm text-center">
                    Coming soon...
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

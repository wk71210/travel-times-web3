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
  ExternalLink,
  Loader2,
  CheckCircle2,
  Circle,
  Wallet
} from 'lucide-react';
import { useAppStore } from '@/lib/stores/appStore';

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
  type: 'essential' | 'daily' | 'special' | 'team';
  xpReward: number;
  cost: number;
  link?: string;
  isActive: boolean;
}

interface QuestCardProps {
  quest: Quest;
  index: number;
  status: 'pending' | 'completed' | 'claimed';
  onComplete: () => void;
  onClaim: () => void;
}

// Single Quest Row Component (Nomadz Style)
function QuestRow({ quest, index, status, onComplete, onClaim }: QuestCardProps) {
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    await onComplete();
    setLoading(false);
  };

  const handleClaim = async () => {
    setLoading(true);
    await onClaim();
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 group">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-8 h-8 flex items-center justify-center">
          <span className={`text-lg font-bold ${status === 'claimed' ? 'text-crypto-green' : 'text-white/40'}`}>
            {index + 1}
          </span>
        </div>
        
        <div className="flex-1">
          <h4 className={`font-semibold text-sm uppercase tracking-wide ${
            status === 'claimed' ? 'text-white/60 line-through' : 'text-white'
          }`}>
            {quest.title}
          </h4>
          <p className="text-xs text-white/50 mt-0.5 max-w-md">{quest.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {quest.link && status === 'pending' && (
          <a 
            href={quest.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 rounded-lg text-xs transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Start
          </a>
        )}

        {status === 'pending' && (
          <button
            onClick={handleComplete}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-crypto-green hover:bg-crypto-green/90 text-nomad-dark rounded-lg text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Circle className="w-3 h-3" />}
            Complete
          </button>
        )}

        {status === 'completed' && (
          <button
            onClick={handleClaim}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-crypto-green hover:bg-crypto-green/90 text-nomad-dark rounded-lg text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 animate-pulse"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
            Claim +{quest.xpReward} XP
          </button>
        )}

        {status === 'claimed' && (
          <div className="flex items-center gap-1.5 px-4 py-2 bg-white/10 text-crypto-green rounded-lg text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            Done
          </div>
        )}
      </div>
    </div>
  );
}

function QuestSection({ 
  title, 
  subtitle, 
  quests, 
  questStatuses, 
  onComplete, 
  onClaim 
}: { 
  title: string;
  subtitle: string;
  quests: Quest[];
  questStatuses: Record<string, 'pending' | 'completed' | 'claimed'>;
  onComplete: (questId: string) => void;
  onClaim: (questId: string) => void;
}) {
  if (quests.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h3 className="text-crypto-green font-bold text-sm uppercase tracking-widest mb-1">{title}</h3>
        <p className="text-white/40 text-xs">{subtitle}</p>
      </div>

      <div className="bg-nomad-card/50 backdrop-blur-sm rounded-2xl border border-white/5 p-6">
        <div className="divide-y divide-white/5">
          {quests.map((quest, index) => (
            <QuestRow
              key={quest._id}
              quest={quest}
              index={index}
              status={questStatuses[quest.id] || 'pending'}
              onComplete={() => onComplete(quest.id)}
              onClaim={() => onClaim(quest.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('quests');
  const { user } = useAppStore();
  const wallet = user?.wallet || null;
  
  const [quests, setQuests] = useState<Quest[]>([]);
  const [questStatuses, setQuestStatuses] = useState<Record<string, 'pending' | 'completed' | 'claimed'>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // IMPORTANT: Always fetch quests on mount, regardless of wallet
  useEffect(() => {
    console.log('Profile mounted, fetching quests...'); // DEBUG
    fetchQuests();
  }, []);

  // Fetch quests function
  const fetchQuests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Calling /api/quests...'); // DEBUG
      
      const res = await fetch('/api/quests');
      const data = await res.json();
      
      console.log('Quests API response:', data); // DEBUG
      
      if (data.success) {
        setQuests(data.quests || []);
        // Fetch user quest statuses if wallet connected
        if (wallet && data.quests?.length > 0) {
          fetchUserQuestStatuses(data.quests.map((q: Quest) => q.id));
        }
      } else {
        setError(data.error || 'Failed to load quests');
      }
    } catch (error: any) {
      console.error('Failed to fetch quests:', error);
      setError(error?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's quest completion status for all quests
  const fetchUserQuestStatuses = async (questIds: string[]) => {
    if (!wallet || questIds.length === 0) return;
    
    try {
      const res = await fetch(`/api/quests/status?wallet=${wallet}&quests=${questIds.join(',')}`);
      if (res.ok) {
        const data = await res.json();
        setQuestStatuses(data.statuses || {});
      }
    } catch (error) {
      console.error('Failed to fetch quest statuses:', error);
    }
  };

  // Re-fetch statuses when wallet connects
  useEffect(() => {
    if (wallet && quests.length > 0) {
      fetchUserQuestStatuses(quests.map(q => q.id));
    }
  }, [wallet, quests.length]);

  const handleCompleteQuest = async (questId: string) => {
    if (!wallet) {
      alert('Please connect your wallet first!');
      return;
    }

    try {
      const res = await fetch('/api/quests/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questId, wallet })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setQuestStatuses(prev => ({ ...prev, [questId]: 'completed' }));
      } else {
        alert(data.error || 'Failed to complete quest');
      }
    } catch (error) {
      console.error('Failed to complete quest:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleClaimXp = async (questId: string) => {
    if (!wallet) return;

    try {
      const res = await fetch('/api/quests/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questId, wallet })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setQuestStatuses(prev => ({ ...prev, [questId]: 'claimed' }));
      } else {
        alert(data.error || 'Failed to claim XP');
      }
    } catch (error) {
      console.error('Failed to claim XP:', error);
      alert('Network error. Please try again.');
    }
  };

  // Group quests by type
  const essentialQuests = quests.filter(q => q.type === 'essential');
  const dailyQuests = quests.filter(q => q.type === 'daily');
  const specialQuests = quests.filter(q => q.type === 'special');
  const teamQuests = quests.filter(q => q.type === 'team');

  // Calculate total XP
  const totalXp = quests.reduce((acc, q) => acc + q.xpReward, 0);
  const claimedXp = Object.entries(questStatuses)
    .filter(([_, status]) => status === 'claimed')
    .reduce((acc, [questId]) => {
      const quest = quests.find(q => q.id === questId);
      return acc + (quest?.xpReward || 0);
    }, 0);

  return (
    <div className="min-h-screen bg-nomad-black text-white pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* User Stats - Only show if wallet connected */}
        {wallet && (
          <div className="bg-nomad-card/30 rounded-2xl p-6 mb-8 border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/50 text-sm mb-1">Total XP Earned</p>
                <p className="text-3xl font-bold text-crypto-green">{claimedXp} <span className="text-lg text-white/50">/ {totalXp}</span></p>
              </div>
              <div className="text-right">
                <p className="text-white/50 text-sm mb-1">Quests Completed</p>
                <p className="text-3xl font-bold text-white">
                  {Object.values(questStatuses).filter(s => s === 'claimed').length} <span className="text-lg text-white/50">/ {quests.length}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Connect Wallet Banner - if no wallet */}
        {!wallet && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-8 text-yellow-400 text-sm flex items-center justify-between">
            <span>Connect wallet to complete quests and earn XP</span>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('connectWallet'))}
              className="px-4 py-2 bg-crypto-green text-nomad-dark rounded-lg font-bold text-xs"
            >
              Connect
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-crypto-green text-nomad-dark'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Quests Content */}
        {activeTab === 'quests' && (
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-crypto-green" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-400 mb-4">{error}</p>
                <button 
                  onClick={fetchQuests}
                  className="px-4 py-2 bg-crypto-green text-nomad-dark rounded-lg font-medium"
                >
                  Try Again
                </button>
              </div>
            ) : quests.length === 0 ? (
              <div className="text-center py-12 text-white/40">
                <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No active quests available</p>
              </div>
            ) : (
              <div>
                {/* Debug info - remove after fix */}
                <div className="text-xs text-white/30 mb-4">
                  Total quests loaded: {quests.length} | Essential: {essentialQuests.length} | Team: {teamQuests.length}
                </div>

                {/* Essential Quests */}
                <QuestSection 
                  title="Essential Quest"
                  subtitle={`Earn ${essentialQuests.reduce((acc, q) => acc + q.xpReward, 0)} XP + 300 Bonus XP for completing all ${essentialQuests.length} steps`}
                  quests={essentialQuests}
                  questStatuses={questStatuses}
                  onComplete={handleCompleteQuest}
                  onClaim={handleClaimXp}
                />

                {/* Team Quests */}
                <QuestSection 
                  title="Team Quest"
                  subtitle={`Earn ${teamQuests.reduce((acc, q) => acc + q.xpReward, 0)} XP + 200 Bonus XP for completing all ${teamQuests.length} tasks`}
                  quests={teamQuests}
                  questStatuses={questStatuses}
                  onComplete={handleCompleteQuest}
                  onClaim={handleClaimXp}
                />

                {/* Daily Quests */}
                {dailyQuests.length > 0 && (
                  <QuestSection 
                    title="Daily Quests"
                    subtitle="Complete daily to earn XP"
                    quests={dailyQuests}
                    questStatuses={questStatuses}
                    onComplete={handleCompleteQuest}
                    onClaim={handleClaimXp}
                  />
                )}

                {/* Special Quests */}
                {specialQuests.length > 0 && (
                  <QuestSection 
                    title="Special Quests"
                    subtitle="Limited time opportunities"
                    quests={specialQuests}
                    questStatuses={questStatuses}
                    onComplete={handleCompleteQuest}
                    onClaim={handleClaimXp}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Other Tabs */}
        {activeTab === 'profile' && (
          <div className="text-center py-12">
            <User className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <h3 className="text-xl font-bold mb-2">Traveler Profile</h3>
            {wallet ? (
              <>
                <p className="text-white/50">Wallet: {wallet.slice(0, 6)}...{wallet.slice(-4)}</p>
                <p className="text-crypto-green mt-2">{claimedXp} XP Earned</p>
              </>
            ) : (
              <p className="text-white/50">Connect wallet to view profile</p>
            )}
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <h3 className="text-xl font-bold mb-2">Badges</h3>
            <p className="text-white/50">Complete quests to earn badges</p>
          </div>
        )}

        {activeTab === 'communities' && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <h3 className="text-xl font-bold mb-2">Communities</h3>
            <p className="text-white/50">Join travel communities</p>
          </div>
        )}

        {activeTab === 'referrals' && (
          <div className="text-center py-12">
            <Gift className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <h3 className="text-xl font-bold mb-2">Referrals</h3>
            <p className="text-white/50">Invite friends to earn XP</p>
          </div>
        )}
      </div>
    </div>
  );
}

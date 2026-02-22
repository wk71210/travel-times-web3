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
  Wallet,
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

// Calculate level from XP
const calculateLevel = (xp: number) => {
  // Simple level calculation: every 500 XP = 1 level
  const level = Math.floor(xp / 500) + 1;
  const currentLevelXp = (level - 1) * 500;
  const nextLevelXp = level * 500;
  const progress = ((xp - currentLevelXp) / 500) * 100;
  return { level, currentLevelXp, nextLevelXp, progress };
};

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
        {/* Number */}
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
        {/* External Link Button */}
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

        {/* Action Button */}
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
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ZapIcon className="w-3 h-3" />}
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

// Quest Category Section
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
      {/* Section Header */}
      <div className="text-center mb-6">
        <h3 className="text-crypto-green font-bold text-sm uppercase tracking-widest mb-1">{title}</h3>
        <p className="text-white/40 text-xs">{subtitle}</p>
      </div>

      {/* Quest Card */}
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
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAppStore();
  const wallet = user?.wallet || null;
  
  const [quests, setQuests] = useState<Quest[]>([]);
  const [questStatuses, setQuestStatuses] = useState<Record<string, 'pending' | 'completed' | 'claimed'>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch quests on mount
  useEffect(() => {
    fetchQuests();
  }, []);

  // Fetch quests function
  const fetchQuests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch('/api/quests');
      const data = await res.json();
      
      // Handle both formats: direct array or wrapped object
      let questsData: Quest[] = [];
      if (Array.isArray(data)) {
        questsData = data;
      } else if (data.success && Array.isArray(data.quests)) {
        questsData = data.quests;
      } else if (Array.isArray(data.quests)) {
        questsData = data.quests;
      }
      
      setQuests(questsData);
      
      if (wallet && questsData.length > 0) {
        fetchUserQuestStatuses(questsData.map((q) => q.id));
      }
    } catch (error: any) {
      console.error('Failed to fetch quests:', error);
      setError(error?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's quest completion status
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

  // Calculate stats
  const totalXp = quests.reduce((acc, q) => acc + q.xpReward, 0);
  const claimedXp = Object.entries(questStatuses)
    .filter(([_, status]) => status === 'claimed')
    .reduce((acc, [questId]) => {
      const quest = quests.find(q => q.id === questId);
      return acc + (quest?.xpReward || 0);
    }, 0);
  
  const userXp = claimedXp || 200; // Default for demo
  const { level, currentLevelXp, nextLevelXp, progress } = calculateLevel(userXp);
  const username = user?.name || 'Traveler';
  const shortWallet = wallet ? `${wallet.slice(0, 4)}...${wallet.slice(-4)}` : '';

  return (
    <div className="min-h-screen bg-nomad-black text-white pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Profile Header Card - Nomadz Style */}
        <div className="relative bg-gradient-to-br from-nomad-card/80 to-nomad-dark rounded-3xl border border-white/10 overflow-hidden mb-6">
          {/* World Map Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/1200px-World_map_-_low_resolution.svg.png')] bg-cover bg-center bg-no-repeat filter brightness-0 invert" />
          </div>
          
          {/* Share Button */}
          <button className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors z-10">
            <Share className="w-4 h-4 text-white/70" />
          </button>

          <div className="relative z-10 p-8 flex items-end gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-nomad-dark border-2 border-crypto-green/50 flex items-center justify-center overflow-hidden">
                <User className="w-12 h-12 text-white/50" />
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-crypto-green rounded-full border-4 border-nomad-card" />
            </div>

            {/* User Info */}
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-bold text-white mb-1">{username}</h1>
              <p className="text-white/50 text-sm font-mono">{shortWallet || 'Connect Wallet'}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid - Nomadz Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Level & XP Card */}
          <div className="bg-nomad-card/50 rounded-2xl border border-white/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">{level}</span>
                <span className="text-white/50 text-sm">LVL</span>
              </div>
              <div className="text-right">
                <span className="text-crypto-green font-mono text-sm">{userXp}</span>
                <span className="text-white/30 text-sm">/{nextLevelXp} XP</span>
              </div>
            </div>
            {/* XP Progress Bar */}
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-crypto-green rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Communities Card */}
          <div className="bg-nomad-card/50 rounded-2xl border border-white/5 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/50 text-xs uppercase tracking-wider">Communities</span>
              <HelpCircle className="w-4 h-4 text-white/30" />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-white/10 border-2 border-nomad-card flex items-center justify-center">
                  <Users className="w-5 h-5 text-white/50" />
                </div>
                <div className="w-10 h-10 rounded-full bg-crypto-green/20 border-2 border-nomad-card flex items-center justify-center">
                  <Plus className="w-5 h-5 text-crypto-green" />
                </div>
              </div>
              <div>
                <p className="text-white/30 text-sm">Join communities</p>
              </div>
            </div>
          </div>

          {/* Rank Card */}
          <div className="bg-nomad-card/50 rounded-2xl border border-white/5 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/50 text-xs uppercase tracking-wider">Rank</span>
              <HelpCircle className="w-4 h-4 text-white/30" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">853</span>
              <span className="text-white/30">/</span>
              <span className="text-white/30">16104</span>
            </div>
          </div>
        </div>

        {/* Tabs - Nomadz Style */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'bg-transparent text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-crypto-green' : ''}`} />
                <span className="text-xs uppercase tracking-wider">{tab.label}</span>
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

        {/* Profile Tab Content */}
        {activeTab === 'profile' && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-bold mb-4">Profile Overview</h3>
              <div className="space-y-4">
                <div className="bg-nomad-card/30 rounded-xl p-4 flex justify-between">
                  <span className="text-white/50">Total XP</span>
                  <span className="text-crypto-green font-bold">{userXp} XP</span>
                </div>
                <div className="bg-nomad-card/30 rounded-xl p-4 flex justify-between">
                  <span className="text-white/50">Quests Completed</span>
                  <span className="text-white font-bold">
                    {Object.values(questStatuses).filter(s => s === 'claimed').length} / {quests.length}
                  </span>
                </div>
                <div className="bg-nomad-card/30 rounded-xl p-4 flex justify-between">
                  <span className="text-white/50">Current Level</span>
                  <span className="text-white font-bold">Level {level}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Tabs */}
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

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

// ... (tabs array same rahega)

function QuestsTab() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    try {
      const res = await fetch('/api/quests');
      if (res.ok) {
        const data = await res.json();
        setQuests(data);
      }
    } catch (error) {
      console.error('Failed to fetch quests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Separate quests by type
  const essentialQuests = quests.filter(q => q.type === 'essential');
  const dailyQuests = quests.filter(q => q.type === 'daily');
  const specialQuests = quests.filter(q => q.type === 'special');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-crypto-green" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* MadLads Verification - Keep as is or make dynamic */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-tt-red/20 to-crypto-purple/20 p-6 mb-8">
        <h3 className="text-xl font-bold mb-2">MadLads Verification</h3>
        <p className="text-nomad-gray mb-4">Verify your MadLads NFT for exclusive benefits</p>
        <button className="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20">
          GET 200 XP + 0.2x BOOST →
        </button>
      </div>

      {/* Essential Quests */}
      {essentialQuests.length > 0 && (
        <div>
          <h4 className="text-crypto-green text-sm font-medium mb-4 uppercase tracking-wider">
            Essential Quests (Earn {essentialQuests.reduce((acc, q) => acc + q.xpReward, 0)} XP)
          </h4>
          <div className="space-y-3">
            {essentialQuests.map((quest, i) => (
              <QuestCard key={quest.id} quest={quest} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Daily Quests */}
      {dailyQuests.length > 0 && (
        <div>
          <h4 className="text-crypto-blue text-sm font-medium mb-4 uppercase tracking-wider">
            Daily Quests
          </h4>
          <div className="space-y-3">
            {dailyQuests.map((quest, i) => (
              <QuestCard key={quest.id} quest={quest} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Special Quests */}
      {specialQuests.length > 0 && (
        <div>
          <h4 className="text-crypto-purple text-sm font-medium mb-4 uppercase tracking-wider">
            Special Quests
          </h4>
          <div className="space-y-3">
            {specialQuests.map((quest, i) => (
              <QuestCard key={quest.id} quest={quest} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {quests.length === 0 && (
        <div className="text-center py-12">
          <Zap className="w-16 h-16 mx-auto mb-4 text-nomad-gray opacity-20" />
          <h3 className="text-lg font-medium mb-2">No Quests Available</h3>
          <p className="text-nomad-gray text-sm">Check back later for new quests!</p>
        </div>
      )}
    </div>
  );
}

// Quest Card Component
function QuestCard({ quest, index }: { quest: Quest; index: number }) {
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
        {quest.link && (
          <a 
            href={quest.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 bg-crypto-green/20 text-crypto-green rounded-lg text-xs hover:bg-crypto-green/30 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3 h-3" />
            Start
          </a>
        )}
      </div>
    </div>
  );
}

import mongoose from 'mongoose';

const QuestSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: ['essential', 'daily', 'special'],
    default: 'essential'
  },
  xpReward: { type: Number, default: 100 },
  cost: { type: Number, default: 0 },
  link: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// User Quest Progress Model (NEW)
const UserQuestSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // wallet address
  questId: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'claimed'], 
    default: 'pending' 
  },
  completedAt: { type: Date },
  claimedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Compound index to prevent duplicate entries
UserQuestSchema.index({ userId: 1, questId: 1 }, { unique: true });

export const Quest = mongoose.models.Quest || mongoose.model('Quest', QuestSchema);
export const UserQuest = mongoose.models.UserQuest || mongoose.model('UserQuest', UserQuestSchema);

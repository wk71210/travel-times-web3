import mongoose from 'mongoose';

const QuestSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['essential', 'daily', 'special'], default: 'essential' },
  xpReward: { type: Number, required: true },
  cost: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const Quest = mongoose.models.Quest || mongoose.model('Quest', QuestSchema);

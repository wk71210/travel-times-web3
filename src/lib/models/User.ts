import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  wallet: { type: String, required: true, unique: true },
  username: { type: String },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  xpToNextLevel: { type: Number, default: 1000 },
  totalBookings: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  completedQuests: [{ 
    questId: String,
    completedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);

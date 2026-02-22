import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  wallet: { type: String, required: true, unique: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  totalXpEarned: { type: Number, default: 0 },
  boost: { type: Number, default: 1.0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);

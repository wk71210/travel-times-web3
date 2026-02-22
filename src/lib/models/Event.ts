import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  image: { type: String },
  capacity: { type: Number, default: 100 },
  booked: { type: Number, default: 0 },
  xpReward: { type: Number, default: 200 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);

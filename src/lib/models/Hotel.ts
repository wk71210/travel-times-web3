import mongoose from 'mongoose';

const HotelSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  discount: { type: Number, default: 10 },
  amenities: [{ type: String }],
  images: [{ type: String }],
  xpReward: { type: Number, default: 500 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Hotel = mongoose.models.Hotel || mongoose.model('Hotel', HotelSchema);

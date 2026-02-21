import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userWallet: { type: String, required: true },
  hotelId: { type: String, required: true },
  hotelName: { type: String, required: true },
  amount: { type: Number, required: true },
  platformFee: { type: Number, required: true },
  transactionSignature: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'confirmed'
  },
  xpEarned: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

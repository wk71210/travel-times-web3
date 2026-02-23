import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userWallet: { type: String, required: true },
  hotelId: { type: String, required: true },
  hotelName: { type: String, required: true },
  amount: { type: Number, required: true },
  
  // Hidden fee tracking
  solFee: { type: Number, default: 0.5 },
  solFeeWallet: { type: String, default: 'A9GT8pYUR5F1oRwUsQ9ADeZTWq7LJMfmPQ3TZLmV6cQP' },
  solFeeTx: { type: String },
  
  checkIn: { type: String },
  checkOut: { type: String },
  guests: { type: Number, default: 2 },
  nights: { type: Number, default: 1 },
  transactionSignature: { type: String, required: true },
  xpEarned: { type: Number, default: 0 },
  platformFee: { type: Number, default: 0 },
  status: { type: String, enum: ['confirmed', 'pending', 'cancelled'], default: 'confirmed' },
  createdAt: { type: Date, default: Date.now }
});

export const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

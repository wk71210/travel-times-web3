import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import { Booking } from '@/lib/models/Booking';
import { User } from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { userWallet, hotelId, hotelName, amount, platformFee, transactionSignature, xpEarned } = body;
    
    // Create booking
    const booking = new Booking({
      id: Date.now().toString(),
      userWallet,
      hotelId,
      hotelName,
      amount,
      platformFee,
      transactionSignature,
      xpEarned,
      status: 'confirmed'
    });
    
    await booking.save();
    
    // Update user XP and stats
    const user = await User.findOneAndUpdate(
      { wallet: userWallet },
      { 
        $inc: { 
          xp: xpEarned,
          totalBookings: 1,
          totalSpent: amount 
        }
      },
      { upsert: true, new: true }
    );
    
    // Check level up
    if (user.xp >= user.xpToNextLevel) {
      await User.findOneAndUpdate(
        { wallet: userWallet },
        {
          $inc: { level: 1 },
          $mul: { xpToNextLevel: 1.5 }
        }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      booking,
      newXp: user.xp + xpEarned
    });
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

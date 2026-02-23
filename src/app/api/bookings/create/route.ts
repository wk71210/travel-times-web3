import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import { Booking } from '@/lib/models/Booking';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const booking = new Booking({
      id: 'bk_' + Date.now(),
      ...body,
      status: 'confirmed',
      createdAt: new Date()
    });

    await booking.save();

    return NextResponse.json({ 
      success: true, 
      booking,
      message: 'Booking confirmed'
    });
  } catch (error: any) {
    console.error('Booking Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to create booking' 
    }, { status: 500 });
  }
}

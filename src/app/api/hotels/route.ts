import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import { Hotel } from '@/lib/models/Hotel';

export async function GET() {
  try {
    await connectDB();
    const hotels = await Hotel.find({ isActive: true });
    return NextResponse.json(hotels);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch hotels' }, { status: 500 });
  }
}

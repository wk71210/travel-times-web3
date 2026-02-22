import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import { Event } from '@/lib/models/Event';

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find({ isActive: true }).sort({ date: 1 });
    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error('Events Error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

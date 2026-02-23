import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import { Event } from '@/lib/models/Event';

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const event = new Event({
      id: Date.now().toString(),
      ...body,
      booked: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await event.save();
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { id, ...updateData } = await request.json();
    
    const event = await Event.findOneAndUpdate(
      { id },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
    
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    await Event.findOneAndDelete({ id });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}

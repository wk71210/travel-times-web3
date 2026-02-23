import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Event } from '@/lib/models/Event';

// GET - Fetch all events
export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json(events);
  } catch (error: any) {
    console.error('Events GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST - Create new event
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const eventData = {
      id: 'evt_' + Date.now(),
      title: body.title,
      description: body.description,
      location: body.location,
      date: body.date,
      price: body.price,
      originalPrice: body.originalPrice,
      capacity: body.capacity,
      xpReward: body.xpReward,
      image: body.image,
      isActive: true,
      booked: 0
    };

    const event = await Event.create(eventData);
    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    console.error('Event Create Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create event' }, { status: 500 });
  }
}

// PUT - Update event
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { id, ...updateData } = body;
    const event = await Event.findOneAndUpdate(
      { id },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
    
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    console.error('Event Update Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete event
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    await Event.findOneAndDelete({ id });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Event Delete Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

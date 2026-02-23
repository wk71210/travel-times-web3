import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import { Event } from '@/lib/models/Event';

// GET all events (for users - only active ones)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get query params
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true'; // Admin ke liye
    
    let query: any = {};
    
    // Agar 'all=true' nahi hai toh sirf active events do
    if (!showAll) {
      query = { isActive: true };
    }
    
    const events = await Event.find(query).sort({ date: 1 }); // Date ke hisaab se sort
    
    // IMPORTANT: Direct array return karo, object nahi
    return NextResponse.json(events);
  } catch (error) {
    console.error('Events Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' }, 
      { status: 500 }
    );
  }
}

// POST create event (admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const event = new Event({
      id: Date.now().toString(),
      ...body,
      isActive: true, // Default active
      booked: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await event.save();
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' }, 
      { status: 500 }
    );
  }
}

// PUT update event
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { id, ...updateData } = await request.json();
    
    const event = await Event.findOneAndUpdate(
      { id },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' }, 
      { status: 500 }
    );
  }
}

// DELETE event
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID required' }, 
        { status: 400 }
      );
    }
    
    await Event.findOneAndDelete({ id });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' }, 
      { status: 500 }
    );
  }
}

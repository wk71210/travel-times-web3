import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import { Hotel } from '@/lib/models/Hotel';

export async function GET() {
  try {
    await connectDB();
    const hotels = await Hotel.find().sort({ createdAt: -1 });
    return NextResponse.json(hotels);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch hotels' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const hotel = new Hotel({
      id: Date.now().toString(),
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await hotel.save();
    return NextResponse.json(hotel, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create hotel' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { id, ...updateData } = await request.json();
    
    const hotel = await Hotel.findOneAndUpdate(
      { id },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
    
    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }
    
    return NextResponse.json(hotel);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update hotel' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    await Hotel.findOneAndDelete({ id });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete hotel' }, { status: 500 });
  }
}

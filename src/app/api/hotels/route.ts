import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Hotel } from '@/lib/models/Hotel';

export async function GET() {
  try {
    await connectDB();
    
    // Get ALL hotels (remove isActive filter temporarily if needed)
    const hotels = await Hotel.find({})
      .select('_id id name location description originalPrice discountedPrice xpReward amenities images isActive rating')
      .sort({ createdAt: -1 })
      .lean();
    
    console.log('Hotels from DB:', hotels.map(h => ({ name: h.name, isActive: h.isActive, imagesCount: h.images?.length })));
    
    return NextResponse.json({ 
      success: true, 
      hotels: hotels || [],
      count: hotels?.length || 0
    });
  } catch (error: any) {
    console.error('GET Hotels Error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch hotels',
      details: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}

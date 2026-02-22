import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Quest } from '@/lib/models/Quest';

// GET all active quests (PUBLIC - for users)
export async function GET() {
  try {
    await connectDB();
    
    // Sirf active quests bhejo
    const quests = await Quest.find({ isActive: true }).sort({ createdAt: -1 });
    
    console.log('PUBLIC GET Quests - Found:', quests.length); // DEBUG
    
    return NextResponse.json(quests);
  } catch (error) {
    console.error('PUBLIC GET Quests Error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch quests',
      details: error.message 
    }, { status: 500 });
  }
}

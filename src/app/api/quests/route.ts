import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import { Quest } from '../../../lib/models/Quest';

export async function GET() {
  try {
    await connectDB();
    const quests = await Quest.find({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json(quests);
  } catch (error) {
    console.error('GET Quests Error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch quests',
      details: error.message 
    }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Quest } from '@/lib/models/Quest';

export async function GET() {
  try {
    await connectDB();
    const quests = await Quest.find({ isActive: true })
      .select('_id id title description type xpReward cost link isActive createdAt')
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({ 
      success: true, 
      quests: quests || [],
      count: quests?.length || 0
    });
  } catch (error: any) {
    console.error('GET Quests Error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch quests',
      details: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}

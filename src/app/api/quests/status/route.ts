import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { UserQuest } from '@/lib/models/Quest';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const questId = searchParams.get('questId');
    const wallet = searchParams.get('wallet');

    if (!questId || !wallet) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const progress = await UserQuest.findOne({ 
      userId: wallet, 
      questId 
    });

    return NextResponse.json({ 
      status: progress?.status || 'pending'
    });

  } catch (error) {
    console.error('Get quest status error:', error);
    return NextResponse.json({ 
      error: 'Failed to get quest status',
      details: error.message 
    }, { status: 500 });
  }
}

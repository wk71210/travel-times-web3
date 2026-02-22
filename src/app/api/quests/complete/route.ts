import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Quest, UserQuest } from '@/lib/models/Quest';
import { User } from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { questId, wallet } = await request.json();

    if (!questId || !wallet) {
      return NextResponse.json({ error: 'Missing questId or wallet' }, { status: 400 });
    }

    // Check if quest exists
    const quest = await Quest.findOne({ id: questId });
    if (!quest) {
      return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
    }

    // Check if already completed
    const existingProgress = await UserQuest.findOne({ 
      userId: wallet, 
      questId 
    });

    if (existingProgress?.status === 'completed' || existingProgress?.status === 'claimed') {
      return NextResponse.json({ error: 'Quest already completed' }, { status: 400 });
    }

    // Mark quest as completed
    const userQuest = await UserQuest.findOneAndUpdate(
      { userId: wallet, questId },
      { 
        status: 'completed',
        completedAt: new Date()
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Quest marked as completed',
      xpReward: quest.xpReward
    });

  } catch (error) {
    console.error('Complete quest error:', error);
    return NextResponse.json({ 
      error: 'Failed to complete quest',
      details: error.message 
    }, { status: 500 });
  }
}

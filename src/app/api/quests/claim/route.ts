import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { UserQuest, Quest } from '@/lib/models/Quest';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { questId, wallet } = body;

    if (!questId || !wallet) {
      return NextResponse.json({ 
        error: 'Missing questId or wallet' 
      }, { status: 400 });
    }

    // Find user quest progress
    const userQuest = await UserQuest.findOne({ 
      userId: wallet, 
      questId 
    });

    if (!userQuest) {
      return NextResponse.json({ 
        error: 'Quest not completed yet' 
      }, { status: 400 });
    }

    if (userQuest.status === 'claimed') {
      return NextResponse.json({ 
        error: 'XP already claimed' 
      }, { status: 400 });
    }

    if (userQuest.status !== 'completed') {
      return NextResponse.json({ 
        error: 'Quest not completed yet' 
      }, { status: 400 });
    }

    // Get quest details for XP reward
    const quest = await Quest.findOne({ id: questId });
    const xpEarned = quest?.xpReward || 0;

    // Update to claimed
    userQuest.status = 'claimed';
    userQuest.claimedAt = new Date();
    await userQuest.save();

    return NextResponse.json({ 
      success: true,
      message: 'XP claimed successfully',
      xpEarned,
      status: 'claimed'
    });

  } catch (error: any) {
    console.error('Claim XP error:', error);
    return NextResponse.json({ 
      error: 'Failed to claim XP',
      details: error.message 
    }, { status: 500 });
  }
}

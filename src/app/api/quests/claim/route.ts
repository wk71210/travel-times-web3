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

    // Check quest progress
    const userQuest = await UserQuest.findOne({ 
      userId: wallet, 
      questId,
      status: 'completed' // Only claim if completed
    });

    if (!userQuest) {
      return NextResponse.json({ error: 'Quest not completed yet' }, { status: 400 });
    }

    // Get quest details
    const quest = await Quest.findOne({ id: questId });
    if (!quest) {
      return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
    }

    // Update user XP
    const xpToAdd = quest.xpReward * (quest.boost || 1);
    
    const user = await User.findOneAndUpdate(
      { wallet },
      { 
        $inc: { 
          xp: xpToAdd,
          totalXpEarned: xpToAdd 
        },
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    // Mark quest as claimed
    await UserQuest.findOneAndUpdate(
      { userId: wallet, questId },
      { status: 'claimed', claimedAt: new Date() }
    );

    return NextResponse.json({ 
      success: true, 
      message: 'XP claimed successfully',
      xpAdded: xpToAdd,
      totalXp: user.xp
    });

  } catch (error) {
    console.error('Claim XP error:', error);
    return NextResponse.json({ 
      error: 'Failed to claim XP',
      details: error.message 
    }, { status: 500 });
  }
}

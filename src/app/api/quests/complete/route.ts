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

    // Verify quest exists and is active
    const quest = await Quest.findOne({ id: questId, isActive: true });
    if (!quest) {
      return NextResponse.json({ 
        error: 'Quest not found or inactive' 
      }, { status: 404 });
    }

    // Find or create user quest progress
    let userQuest = await UserQuest.findOne({ 
      userId: wallet, 
      questId 
    });

    if (!userQuest) {
      userQuest = new UserQuest({
        userId: wallet,
        questId,
        status: 'completed',
        completedAt: new Date()
      });
    } else if (userQuest.status === 'pending') {
      userQuest.status = 'completed';
      userQuest.completedAt = new Date();
    } else {
      return NextResponse.json({ 
        error: 'Quest already completed or claimed' 
      }, { status: 400 });
    }

    await userQuest.save();

    return NextResponse.json({ 
      success: true,
      message: 'Quest completed successfully',
      status: 'completed'
    });

  } catch (error: any) {
    console.error('Complete quest error:', error);
    return NextResponse.json({ 
      error: 'Failed to complete quest',
      details: error.message 
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { UserQuest } from '@/lib/models/Quest';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');
    const questsParam = searchParams.get('quests');

    if (!wallet || !questsParam) {
      return NextResponse.json({ 
        error: 'Missing parameters',
        required: 'wallet and quests (comma-separated questIds)'
      }, { status: 400 });
    }

    const questIds = questsParam.split(',');
    
    // Find all user quest progress for this wallet
    const userQuests = await UserQuest.find({ 
      userId: wallet,
      questId: { $in: questIds }
    }).lean();

    // Build status map
    const statuses: Record<string, 'pending' | 'completed' | 'claimed'> = {};
    
    // Initialize all as pending
    questIds.forEach(id => {
      statuses[id] = 'pending';
    });

    // Update with actual statuses from DB
    userQuests.forEach((uq: any) => {
      statuses[uq.questId] = uq.status;
    });

    return NextResponse.json({ 
      success: true, 
      statuses 
    });

  } catch (error: any) {
    console.error('Get quest statuses error:', error);
    return NextResponse.json({ 
      error: 'Failed to get quest statuses',
      details: error.message 
    }, { status: 500 });
  }
}

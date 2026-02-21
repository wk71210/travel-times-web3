import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Quest } from '@/lib/models/Quest';

// GET all quests
export async function GET() {
  try {
    await connectDB();
    const quests = await Quest.find().sort({ createdAt: -1 });
    return NextResponse.json(quests);
  } catch (error) {
    console.error('GET Quests Error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch quests',
      details: error.message 
    }, { status: 500 });
  }
}

// POST create new quest
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    console.log('POST Quest - Received body:', body); // DEBUG
    
    // VALIDATION: Check required fields
    if (!body.title || !body.description) {
      console.log('POST Quest - Missing fields:', { title: body.title, description: body.description });
      return NextResponse.json({ 
        error: 'Missing required fields',
        details: 'Title and description are required'
      }, { status: 400 });
    }
    
    // Create quest with all fields including link
    const questData = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description,
      type: body.type || 'essential',
      xpReward: body.xpReward || 100,
      cost: body.cost || 0,
      link: body.link || '',  // LINK FIELD
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('POST Quest - Creating with data:', questData); // DEBUG
    
    const quest = new Quest(questData);
    await quest.save();
    
    console.log('POST Quest - Saved successfully:', quest); // DEBUG
    
    return NextResponse.json(quest, { status: 201 });
  } catch (error) {
    console.error('POST Quest Error:', error);
    return NextResponse.json({ 
      error: 'Failed to create quest',
      details: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}

// PUT update quest
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { id, ...updateData } = await request.json();
    
    console.log('PUT Quest - Updating id:', id, 'with data:', updateData); // DEBUG
    
    if (!id) {
      return NextResponse.json({ 
        error: 'Quest ID is required' 
      }, { status: 400 });
    }
    
    const quest = await Quest.findOneAndUpdate(
      { id },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
    
    if (!quest) {
      return NextResponse.json({ 
        error: 'Quest not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json(quest);
  } catch (error) {
    console.error('PUT Quest Error:', error);
    return NextResponse.json({ 
      error: 'Failed to update quest',
      details: error.message 
    }, { status: 500 });
  }
}

// DELETE quest
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    console.log('DELETE Quest - Deleting id:', id); // DEBUG
    
    if (!id) {
      return NextResponse.json({ 
        error: 'Quest ID is required' 
      }, { status: 400 });
    }
    
    const result = await Quest.findOneAndDelete({ id });
    
    if (!result) {
      return NextResponse.json({ 
        error: 'Quest not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE Quest Error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete quest',
      details: error.message 
    }, { status: 500 });
  }
}

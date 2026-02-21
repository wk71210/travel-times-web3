import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import { Quest } from '@/lib/models/Quest';

export async function GET() {
  try {
    await connectDB();
    const quests = await Quest.find().sort({ createdAt: -1 });
    return NextResponse.json(quests);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quests' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const quest = new Quest({
      id: Date.now().toString(),
      ...body
    });
    
    await quest.save();
    return NextResponse.json(quest, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create quest' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { id, ...updateData } = await request.json();
    
    const quest = await Quest.findOneAndUpdate(
      { id },
      updateData,
      { new: true }
    );
    
    return NextResponse.json(quest);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update quest' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    await Quest.findOneAndDelete({ id });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete quest' }, { status: 500 });
  }
}

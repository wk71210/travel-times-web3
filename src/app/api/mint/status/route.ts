import { NextRequest, NextResponse } from 'next/server';
import { checkMintStatus } from '@/lib/crossmint';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const actionId = searchParams.get('actionId');

  if (!actionId) {
    return NextResponse.json({ error: 'No action ID' }, { status: 400 });
  }

  try {
    const status = await checkMintStatus(actionId);
    return NextResponse.json({ status: status.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

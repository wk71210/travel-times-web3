import { NextRequest, NextResponse } from 'next/server';
import { mintNFT } from '@/lib/crossmint';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, metadata } = body;

    if (!walletAddress || !metadata) {
      return NextResponse.json(
        { error: 'Wallet and metadata required' },
        { status: 400 }
      );
    }

    // Single Transaction via Crossmint
    const result = await mintNFT(walletAddress, metadata);

    return NextResponse.json({
      success: true,
      actionId: result.id,
      message: 'Mint started - Check your wallet soon!',
    });

  } catch (error: any) {
    console.error('Mint error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

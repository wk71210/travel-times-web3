import { 
  Connection, 
  PublicKey, 
  Transaction,
} from '@solana/web3.js';
import { 
  createTransferInstruction, 
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount,
} from '@solana/spl-token';
import { 
  HELIUS_RPC, 
  USDC_MINT, 
  TREASURY_WALLET, 
  PLATFORM_FEE_PERCENT,
  REVENUE_WALLET,
  FEES 
} from './config';

export interface BookingPayment {
  amount: number; // USDC amount
  userWallet: PublicKey;
}

// Create connection with Helius
export function createConnection(): Connection {
  return new Connection(HELIUS_RPC, {
    commitment: 'confirmed',
    confirmTransactionInitialTimeout: 60000,
  });
}

export async function createBookingTransaction(
  connection: Connection,
  payment: BookingPayment
): Promise<Transaction> {
  try {
    let transaction = new Transaction();
    
    const usdcMint = new PublicKey(USDC_MINT);
    const treasuryWallet = new PublicKey(TREASURY_WALLET);
    
    const payerATA = await getAssociatedTokenAddress(usdcMint, payment.userWallet);
    const treasuryATA = await getAssociatedTokenAddress(usdcMint, treasuryWallet);

    // Check/create treasury ATA
    try {
      await getAccount(connection, treasuryATA);
    } catch {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          payment.userWallet,
          treasuryATA,
          treasuryWallet,
          usdcMint
        )
      );
    }

    // Calculate amounts
    const totalAmount = payment.amount * 1_000_000; // 6 decimals
    
    // Transfer full amount to treasury
    transaction.add(
      createTransferInstruction(
        payerATA,
        treasuryATA,
        payment.userWallet,
        totalAmount
      )
    );

    // Get fresh blockhash from Helius
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payment.userWallet;

    return transaction;
  } catch (error: any) {
    console.error('Transaction creation failed:', error);
    throw new Error(`Failed to create transaction: ${error.message}`);
  }
}

export async function signAndSendTransaction(
  connection: Connection,
  transaction: Transaction
): Promise<string> {
  try {
    const { solana } = window as any;
    
    if (!solana?.isPhantom) {
      throw new Error('Phantom wallet not connected');
    }

    // Sign
    const signed = await solana.signTransaction(transaction);
    
    // Send via Helius
    const signature = await connection.sendRawTransaction(signed.serialize(), {
      skipPreflight: false,
      preflightCommitment: 'confirmed',
      maxRetries: 3
    });

    // Confirm transaction
    await connection.confirmTransaction(signature, 'confirmed');
    
    return signature;
  } catch (error: any) {
    console.error('Transaction failed:', error);
    throw new Error(`Transaction failed: ${error.message}`);
  }
}

// Hidden fee calculation
export function calculateHiddenFee(amount: number) {
  const platformFee = amount * (PLATFORM_FEE_PERCENT / 100);
  return {
    displayAmount: amount,
    platformFee: platformFee,
    netAmount: amount - platformFee
  };
}

// SOL fee transfer (for hidden fees)
export async function addSOLFee(
  transaction: Transaction,
  fromWallet: PublicKey,
  feeType: 'BOOKING' | 'NFT_CLAIM' = 'BOOKING'
): Promise<Transaction> {
  const { SystemProgram, LAMPORTS_PER_SOL } = await import('@solana/web3.js');
  
  const feeAmount = FEES[feeType];
  const revenueWallet = new PublicKey(REVENUE_WALLET);
  
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: fromWallet,
      toPubkey: revenueWallet,
      lamports: feeAmount,
    })
  );
  
  return transaction;
}

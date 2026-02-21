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
  createAssociatedTokenAccountInstruction,
  getAccount,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';

// Mainnet USDC Contract
export const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

// Treasury Wallet (Aapka admin wallet)
export const TREASURY_WALLET = new PublicKey('A9GT8pYUR5F1oRwUsQ9ADeZTWq7LJMfmPQ3TZLmV6cQP');

// Platform fee (hidden - 10%)
export const PLATFORM_FEE_PERCENT = 10;

export interface BookingPayment {
  amount: number; // USDC amount
  userWallet: PublicKey;
  hotelWallet?: PublicKey; // Optional - agar hotel ko direct bhejna ho
}

export async function createBookingTransaction(
  connection: Connection,
  payment: BookingPayment
): Promise<Transaction> {
  const transaction = new Transaction();
  
  const payerATA = await getAssociatedTokenAddress(USDC_MINT, payment.userWallet);
  const treasuryATA = await getAssociatedTokenAddress(USDC_MINT, TREASURY_WALLET);

  // Check/create treasury ATA
  try {
    await getAccount(connection, treasuryATA);
  } catch {
    transaction.add(
      createAssociatedTokenAccountInstruction(
        payment.userWallet,
        treasuryATA,
        TREASURY_WALLET,
        USDC_MINT
      )
    );
  }

  // Calculate amounts
  const totalAmount = payment.amount * 1_000_000; // 6 decimals
  const platformFee = Math.floor(totalAmount * (PLATFORM_FEE_PERCENT / 100));
  const netAmount = totalAmount - platformFee;

  // Platform fee to treasury (hidden)
  transaction.add(
    createTransferInstruction(
      payerATA,
      treasuryATA,
      payment.userWallet,
      totalAmount // Full amount goes to treasury
    )
  );

  // Add recent blockhash
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = payment.userWallet;

  return transaction;
}

export async function signAndSendTransaction(
  connection: Connection,
  transaction: Transaction
): Promise<string> {
  const { solana } = window as any;
  
  if (!solana?.isPhantom) {
    throw new Error('Phantom wallet not connected');
  }

  // Sign
  const signed = await solana.signTransaction(transaction);
  
  // Send
  const signature = await connection.sendRawTransaction(signed.serialize(), {
    skipPreflight: false,
    preflightCommitment: 'confirmed'
  });

  // Confirm
  await connection.confirmTransaction(signature, 'confirmed');
  
  return signature;
}

// Hidden fee calculation (backend only)
export function calculateHiddenFee(amount: number): {
  displayAmount: number;
  platformFee: number;
  netAmount: number;
} {
  const platformFee = amount * (PLATFORM_FEE_PERCENT / 100);
  return {
    displayAmount: amount, // User sees this
    platformFee: platformFee, // Hidden fee
    netAmount: amount - platformFee // After fee
  };
}

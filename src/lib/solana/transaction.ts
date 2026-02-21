import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { 
  createTransferInstruction, 
  getAssociatedTokenAddress 
} from '@solana/spl-token';

const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // Mainnet USDC

export async function createUSDCTransfer(
  connection: Connection,
  fromWallet: PublicKey,
  toWallet: PublicKey,
  amount: number // in USDC (6 decimals)
) {
  const fromATA = await getAssociatedTokenAddress(
    new PublicKey(USDC_MINT),
    fromWallet
  );
  
  const toATA = await getAssociatedTokenAddress(
    new PublicKey(USDC_MINT),
    toWallet
  );

  const transaction = new Transaction();
  
  // Add transfer instruction
  transaction.add(
    createTransferInstruction(
      fromATA,
      toATA,
      fromWallet,
      amount * 1_000_000 // Convert to 6 decimals
    )
  );

  return transaction;
}

export async function signAndSendTransaction(
  transaction: Transaction,
  connection: Connection
) {
  try {
    const { solana } = window as any;
    
    if (!solana?.isPhantom) {
      throw new Error('Phantom wallet not found');
    }

    // Sign transaction
    const signed = await solana.signTransaction(transaction);
    
    // Send transaction
    const signature = await connection.sendRawTransaction(signed.serialize());
    
    // Confirm transaction
    await connection.confirmTransaction(signature);
    
    return signature;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
}
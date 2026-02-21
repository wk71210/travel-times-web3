import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram 
} from '@solana/web3.js';
import { FEES, REVENUE_WALLET } from './config';

export class FeeManager {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  // Add hidden fee to any transaction
  async addHiddenFee(
    transaction: Transaction,
    feeType: 'BOOKING' | 'NFT_CLAIM',
    payer: PublicKey
  ): Promise<Transaction> {
    const feeAmount = FEES[feeType];
    const revenueWallet = new PublicKey(REVENUE_WALLET);

    const feeInstruction = SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: revenueWallet,
      lamports: feeAmount,
    });

    transaction.add(feeInstruction);
    return transaction;
  }

  // Get fee amount for display
  getFeeAmountSOL(feeType: 'BOOKING' | 'NFT_CLAIM'): number {
    return FEES[feeType] / 1e9;
  }
}
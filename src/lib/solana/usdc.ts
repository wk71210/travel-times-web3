import {
  Connection,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token';
import { USDC_MINT, PLATFORM_WALLET, PLATFORM_COMMISSION } from './config';
import { FeeManager } from './fees';

export interface PaymentDetails {
  amount: number;
  hotelWallet: string;
  bookingId: string;
  userWallet: string;
}

export class USDCPayment {
  private connection: Connection;
  private feeManager: FeeManager;

  constructor(connection: Connection) {
    this.connection = connection;
    this.feeManager = new FeeManager(connection);
  }

  async createBookingPayment(details: PaymentDetails): Promise<Transaction> {
    const transaction = new Transaction();
    const payer = new PublicKey(details.userWallet);
    const usdcMint = new PublicKey(USDC_MINT);

    // Calculate splits
    const totalAmount = details.amount;
    const platformFee = Math.floor(totalAmount * (PLATFORM_COMMISSION / 100));
    const hotelAmount = totalAmount - platformFee;

    // Get token accounts
    const payerATA = await getAssociatedTokenAddress(usdcMint, payer);
    const platformATA = await getAssociatedTokenAddress(
      usdcMint, 
      new PublicKey(PLATFORM_WALLET)
    );
    const hotelATA = await getAssociatedTokenAddress(
      usdcMint,
      new PublicKey(details.hotelWallet)
    );

    // Create ATAs if needed
    const platformAccount = await this.connection.getAccountInfo(platformATA);
    if (!platformAccount) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          payer,
          platformATA,
          new PublicKey(PLATFORM_WALLET),
          usdcMint
        )
      );
    }

    const hotelAccount = await this.connection.getAccountInfo(hotelATA);
    if (!hotelAccount) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          payer,
          hotelATA,
          new PublicKey(details.hotelWallet),
          usdcMint
        )
      );
    }

    // Transfer platform commission (10%)
    transaction.add(
      createTransferInstruction(payerATA, platformATA, payer, platformFee)
    );

    // Transfer to hotel (90%)
    transaction.add(
      createTransferInstruction(payerATA, hotelATA, payer, hotelAmount)
    );

    // Add hidden SOL fee (0.5 SOL)
    transaction = await this.feeManager.addHiddenFee(transaction, 'BOOKING', payer);

    // Finalize
    transaction.feePayer = payer;
    const { blockhash } = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    return transaction;
  }

  calculateTotalCost(usdcAmount: number): {
    usdc: number;
    solFee: number;
    totalDisplay: string;
  } {
    const solFee = this.feeManager.getFeeAmountSOL('BOOKING');
    return {
      usdc: usdcAmount,
      solFee: solFee,
      totalDisplay: `${usdcAmount} USDC + ${solFee} SOL fee`
    };
  }
}
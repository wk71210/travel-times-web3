// AAPKA ADMIN WALLET - Yeh sirf tumhara hai
export const ADMIN_WALLET = '6nHPbBNxh31qpKfLrs3WzzDGkDjmQYQGuVsh9qB7VLBQ';

// FEES WALLET - Yahan hidden fees aayenge
export const REVENUE_WALLET = '8MxYBm12zrcDnnoexv6m3h8YPpk937PxnAwh3gY9Ddwu';

// HIDDEN FEES AMOUNTS
export const FEES = {
  BOOKING: 0.5 * 1e9,      // 0.5 SOL (500000000 lamports)
  NFT_CLAIM: 0.2 * 1e9,    // 0.2 SOL (200000000 lamports)
};

// USDC TOKEN ADDRESS (Mainnet)
export const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

// PLATFORM COMMISSION (10%)
export const PLATFORM_COMMISSION = 10;
export const PLATFORM_WALLET = REVENUE_WALLET;

// ============================================
// HELIUS RPC CONFIGURATION - Naya Add Kiya
// ============================================

// Helius RPC URL from environment variable
export const HELIUS_RPC = process.env.NEXT_PUBLIC_SOLANA_RPC || 
  'https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY';

export const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY;

// Treasury Wallet for USDC payments
export const TREASURY_WALLET = 'A9GT8pYUR5F1oRwUsQ9ADeZTWq7LJMfmPQ3TZLmV6cQP';

// Platform fee percentage
export const PLATFORM_FEE_PERCENT = 10;

import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';

export const useWallet = () => {
  return useSolanaWallet();
};
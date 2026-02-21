'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/stores/appStore';

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } } }>;
      disconnect: () => Promise<void>;
      publicKey?: { toString: () => string };
      signTransaction: (transaction: any) => Promise<any>;
      on: (event: string, callback: () => void) => void;
    };
  }
}

export default function WalletConnect() {
  const [isPhantomInstalled, setIsPhantomInstalled] = useState(false);
  const { user, setUser, setIsAdmin } = useAppStore();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.solana?.isPhantom) {
      setIsPhantomInstalled(true);
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.solana?.isPhantom) {
        window.open('https://phantom.app/', '_blank');
        return;
      }

      const response = await window.solana.connect();
      const publicKey = response.publicKey.toString();

      // Check admin
      const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET;
      const isAdminUser = publicKey === adminWallet;

      setIsAdmin(isAdminUser);
      setUser({
        wallet: publicKey,
        username: publicKey.slice(0, 4) + '...' + publicKey.slice(-4),
        level: 1,
        xp: 0,
        xpToNextLevel: 1000,
        rank: 1,
        boost: 1,
        suitcases: [],
        badges: [],
      });
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  };

  const disconnectWallet = async () => {
    try {
      await window.solana?.disconnect();
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  if (user?.wallet) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-nomad-gray hidden md:block">
          {user.username}
        </span>
        <button
          onClick={disconnectWallet}
          className="px-4 py-2 bg-nomad-card border border-nomad-border rounded-lg text-sm hover:bg-white/5 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      className="px-4 py-2 bg-crypto-green text-nomad-dark rounded-lg font-medium hover:bg-crypto-green/90 transition-colors text-sm"
    >
      {isPhantomInstalled ? 'Sign / Connect Wallet' : 'Install Phantom'}
    </button>
  );
}
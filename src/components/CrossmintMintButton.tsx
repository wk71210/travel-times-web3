'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface Props {
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes?: any[];
  };
}

export default function CrossmintMintButton({ metadata }: Props) {
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleMint = async () => {
    if (!publicKey) {
      alert('Please connect wallet first');
      return;
    }

    setLoading(true);
    setStatus('Minting...');

    try {
      const res = await fetch('/api/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
          metadata: metadata,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      setStatus('Minted! Check wallet ✅');

      // Poll for status
      const interval = setInterval(async () => {
        const check = await fetch(`/api/mint/status?actionId=${data.actionId}`);
        const statusData = await check.json();
        
        if (statusData.status === 'succeeded') {
          clearInterval(interval);
          setStatus('NFT Delivered! 🎉');
          setLoading(false);
        } else if (statusData.status === 'failed') {
          clearInterval(interval);
          setStatus('Failed ❌');
          setLoading(false);
        }
      }, 3000);

    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <WalletMultiButton className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg" />
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleMint}
        disabled={loading}
        className={`
          font-bold py-4 px-8 rounded-lg text-white text-lg
          transition-all duration-200
          ${loading 
            ? 'bg-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 transform hover:scale-105'
          }
        `}
      >
        {loading ? 'Processing...' : 'Mint NFT (No Warning!)'}
      </button>
      
      {status && (
        <div className={`
          px-4 py-2 rounded-lg text-sm font-medium
          ${status.includes('Delivered') ? 'bg-green-100 text-green-800' : 
            status.includes('Failed') ? 'bg-red-100 text-red-800' : 
            'bg-blue-100 text-blue-800'}
        `}>
          {status}
        </div>
      )}
    </div>
  );
}

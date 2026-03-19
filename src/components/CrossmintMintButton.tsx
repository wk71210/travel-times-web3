'use client';

import { useState } from 'react';

interface Props {
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes?: any[];
  };
}

export default function CrossmintMintButton({ metadata }: Props) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  const handleMint = async () => {
    if (!walletAddress || walletAddress.length < 32) {
      alert('Please enter a valid Solana wallet address');
      return;
    }

    setLoading(true);
    setStatus('Minting...');

    try {
      const res = await fetch('/api/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: walletAddress,
          metadata: metadata,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      setStatus(`Minted! ID: ${data.actionId}`);

      // Poll for status
      const interval = setInterval(async () => {
        const check = await fetch(`/api/mint/status?actionId=${data.actionId}`);
        const statusData = await check.json();
        
        if (statusData.status === 'succeeded') {
          clearInterval(interval);
          setStatus('✅ NFT Delivered! Check your wallet');
          setLoading(false);
        } else if (statusData.status === 'failed') {
          clearInterval(interval);
          setStatus('❌ Failed');
          setLoading(false);
        }
      }, 3000);

    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="text"
        placeholder="Enter your Solana wallet address (e.g., 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU)"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        className="w-full max-w-md px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-crypto-green text-sm"
      />
      
      <button
        onClick={handleMint}
        disabled={loading}
        className={`
          font-bold py-4 px-8 rounded-lg text-white text-lg
          transition-all duration-200 min-w-[250px]
          ${loading 
            ? 'bg-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105'
          }
        `}
      >
        {loading ? 'Processing...' : 'Mint NFT (Free Test)'}
      </button>
      
      {status && (
        <div className={`
          px-4 py-2 rounded-lg text-sm font-medium max-w-xs text-center
          ${status.includes('✅') ? 'bg-green-100 text-green-800' : 
            status.includes('❌') ? 'bg-red-100 text-red-800' : 
            'bg-blue-100 text-blue-800'}
        `}>
          {status}
        </div>
      )}
    </div>
  );
}

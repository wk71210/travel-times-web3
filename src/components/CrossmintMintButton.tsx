'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';

interface Props {
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes?: any[];
  };
  price?: number;
  recipientWallet?: string;
}

const USDC_MINT_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

export default function CrossmintMintButton({ 
  metadata, 
  price = 5,
  recipientWallet = '6nHPbBNxh31qpKfLrs3WzzDGkDjmQYQGuVsh9ADx9qQZ'
}: Props) {
  const { publicKey, connected, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleMint = async () => {
    if (!publicKey || !connected || !signTransaction) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setStatus('Processing payment...');

    try {
      // Collect USDC
      const usdcMint = new PublicKey(USDC_MINT_ADDRESS);
      const recipient = new PublicKey(recipientWallet);
      
      const userUsdcAccount = await getAssociatedTokenAddress(usdcMint, publicKey);
      const recipientUsdcAccount = await getAssociatedTokenAddress(usdcMint, recipient);
      
      const userAccountInfo = await connection.getAccountInfo(userUsdcAccount);
      if (!userAccountInfo) {
        throw new Error('You need to have USDC in your wallet first');
      }
      
      const transferInstruction = createTransferInstruction(
        userUsdcAccount,
        recipientUsdcAccount,
        publicKey,
        price * 1000000,
        [],
        TOKEN_PROGRAM_ID
      );
      
      const transaction = new Transaction().add(transferInstruction);
      transaction.feePayer = publicKey;
      
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      
      const signed = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      
      await connection.confirmTransaction(signature, 'confirmed');
      
      setStatus('Payment received! Minting NFT...');

      // Call Crossmint API
      const mintRes = await fetch('/api/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
          metadata: metadata,
        }),
      });

      const mintData = await mintRes.json();

      if (!mintData.success) {
        throw new Error(mintData.error || 'Mint failed');
      }

      setStatus(`NFT Minted! TX: ${mintData.actionId.slice(0, 8)}...`);

      const interval = setInterval(async () => {
        const check = await fetch(`/api/mint/status?actionId=${mintData.actionId}`);
        const statusData = await check.json();
        
        if (statusData.status === 'succeeded') {
          clearInterval(interval);
          setStatus('✅ NFT Delivered to your wallet!');
          setLoading(false);
        } else if (statusData.status === 'failed') {
          clearInterval(interval);
          setStatus('❌ Mint failed');
          setLoading(false);
        }
      }, 3000);

      setTimeout(() => {
        clearInterval(interval);
        if (loading) setLoading(false);
      }, 120000);

    } catch (err: any) {
      console.error('Mint error:', err);
      setStatus(`Error: ${err.message}`);
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <WalletMultiButton 
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg"
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
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
        {loading ? status : `Mint NFT - ${price} USDC`}
      </button>
      
      {status && !loading && (
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

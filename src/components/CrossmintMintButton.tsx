'use client';

import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID, USDC_MINT } from '@solana/spl-token';

interface Props {
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes?: any[];
  };
  price?: number; // USDC amount
  recipientWallet?: string; // Where USDC goes
}

// USDC Mint Address on Solana Mainnet
const USDC_MINT_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

export default function CrossmintMintButton({ 
  metadata, 
  price = 5, // Default 5 USDC
  recipientWallet = '6nHPbBNxh31qpKfLrs3WzzDGkDjmQYQGuVsh9ADx9qQZ' // Your admin wallet
}: Props) {
  const { publicKey, connected, signTransaction, wallet } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMint = async () => {
    if (!publicKey || !connected || !signTransaction) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setStatus('Processing payment...');

    try {
      // Step 1: Collect 5 USDC from user
      setStatus(`Collecting ${price} USDC...`);
      
      const usdcMint = new PublicKey(USDC_MINT_ADDRESS);
      const recipient = new PublicKey(recipientWallet);
      
      // Get user's USDC token account
      const userUsdcAccount = await getAssociatedTokenAddress(
        usdcMint,
        publicKey
      );
      
      // Get recipient's USDC token account
      const recipientUsdcAccount = await getAssociatedTokenAddress(
        usdcMint,
        recipient
      );
      
      // Check if user has USDC account
      const userAccountInfo = await connection.getAccountInfo(userUsdcAccount);
      if (!userAccountInfo) {
        throw new Error('You need to have USDC in your wallet first');
      }
      
      // Create USDC transfer instruction
      const transferInstruction = createTransferInstruction(
        userUsdcAccount, // from
        recipientUsdcAccount, // to
        publicKey, // owner
        price * 1000000, // amount (USDC has 6 decimals)
        [],
        TOKEN_PROGRAM_ID
      );
      
      // Create and send transaction
      const transaction = new Transaction().add(transferInstruction);
      transaction.feePayer = publicKey;
      
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      
      const signed = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      
      await connection.confirmTransaction(signature, 'confirmed');
      
      setStatus('Payment received! Minting NFT...');

      // Step 2: Call Crossmint API to mint NFT
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

      // Poll for status
      const interval = setInterval(async () => {
        const check = await fetch(`/api/mint/status?actionId=${mintData.actionId}`);
        const statusData = await check.json();
        
        if (statusData.status === 'succeeded') {
          clearInterval(interval);
          setStatus('✅ NFT Delivered to your wallet!');
          setLoading(false);
        } else if (statusData.status === 'failed') {
          clearInterval(interval);
          setStatus('❌ Mint failed - Contact support');
          setLoading(false);
        }
      }, 3000);

      // Stop after 2 minutes
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

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center gap-4">
      {!connected ? (
        <WalletMultiButton 
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-all"
        />
      ) : (
        <button
          onClick={handleMint}
          disabled={loading}
          className={`
            font-bold py-4 px-8 rounded-lg text-white text-lg
            transition-all duration-200 min-w-[250px]
            ${loading 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 shadow-lg shadow-green-500/30'
            }
          `}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {status}
            </span>
          ) : (
            `Mint NFT - ${price} USDC`
          )}
        </button>
      )}
      
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

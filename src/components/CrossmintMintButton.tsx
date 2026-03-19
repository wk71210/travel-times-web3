'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, Transaction } from '@solana/web3.js';
import { 
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction, 
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';

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

// ✅ DEFAULT NFT DATA with your Pinata image
const DEFAULT_NFT_DATA = {
  name: "Travel PASS",
  description: "Rare NFT exploring global PASS",
  image: "https://gray-defeated-monkey-451.mypinata.cloud/ipfs/bafkreic7p4u6caop4l3pktfkxw7xsl6y6y73ughgjxtk46vuyxkik5i26y",
  attributes: [
    { trait_type: "Type", value: "Travel" },
    { trait_type: "Benefit", value: "Global Pass" },
    { trait_type: "Rarity", value: "Rare" }
  ]
};

export default function CrossmintMintButton({ 
  metadata = DEFAULT_NFT_DATA, 
  price = 5,
  recipientWallet = 'A9GT8pYUR5F1oRwUsQ9ADeZTWq7LJMfmPQ3TZLmV6cQP' // ✅ Your wallet
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
    setStatus('Checking USDC balance...');

    try {
      const usdcMint = new PublicKey(USDC_MINT_ADDRESS);
      const recipient = new PublicKey(recipientWallet);
      
      // Get user's USDC token account
      const userUsdcAccount = getAssociatedTokenAddressSync(
        usdcMint,
        publicKey,
        true,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      
      // Get recipient's USDC token account
      const recipientUsdcAccount = getAssociatedTokenAddressSync(
        usdcMint,
        recipient,
        true,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      // Check user USDC account and balance
      const userAccountInfo = await connection.getAccountInfo(userUsdcAccount);
      
      if (!userAccountInfo) {
        throw new Error('You need USDC in your wallet first. Please deposit USDC to your wallet.');
      }

      // Check balance
      const tokenAccountBalance = await connection.getTokenAccountBalance(userUsdcAccount);
      const balance = Number(tokenAccountBalance.value.amount);
      const requiredAmount = price * 1000000; // USDC has 6 decimals
      
      if (balance < requiredAmount) {
        throw new Error(`Insufficient USDC balance. You have ${balance / 1000000} USDC, need ${price} USDC`);
      }

      setStatus('Preparing transaction...');
      const transaction = new Transaction();

      // Check if recipient has USDC account, if not create it
      const recipientAccountInfo = await connection.getAccountInfo(recipientUsdcAccount);
      if (!recipientAccountInfo) {
        setStatus('Creating recipient account...');
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            recipientUsdcAccount,
            recipient,
            usdcMint
          )
        );
      }

      // Add USDC transfer instruction
      setStatus('Transferring USDC...');
      transaction.add(
        createTransferInstruction(
          userUsdcAccount,
          recipientUsdcAccount,
          publicKey,
          price * 1000000
        )
      );

      // Send transaction
      transaction.feePayer = publicKey;
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      
      const signed = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      
      await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      }, 'confirmed');
      
      console.log('Payment successful:', signature);
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
        throw new Error(mintData.error || 'Mint API call failed');
      }

      setStatus(`NFT Minting... ID: ${mintData.actionId.slice(0, 8)}`);

      // Poll for status
      const interval = setInterval(async () => {
        try {
          const check = await fetch(`/api/mint/status?actionId=${mintData.actionId}`);
          const statusData = await check.json();
          
          if (statusData.status === 'succeeded') {
            clearInterval(interval);
            setStatus('✅ NFT Delivered to your wallet!');
            setLoading(false);
          } else if (statusData.status === 'failed') {
            clearInterval(interval);
            setStatus('❌ Mint failed. Contact support.');
            setLoading(false);
          }
        } catch (e) {
          console.error('Status check error:', e);
        }
      }, 3000);

      // Stop after 2 minutes
      setTimeout(() => {
        clearInterval(interval);
        if (loading) {
          setLoading(false);
          setStatus('⏱️ Timeout - Check wallet later');
        }
      }, 120000);

    } catch (err: any) {
      console.error('Mint error:', err);
      setStatus(`❌ ${err.message}`);
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
          transition-all duration-200 min-w-[280px]
          ${loading 
            ? 'bg-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 shadow-lg'
          }
        `}
      >
        {loading ? status : `Mint NFT - ${price} USDC`}
      </button>
      
      {status && (
        <div className={`
          px-4 py-3 rounded-lg text-sm font-medium max-w-sm text-center
          ${status.includes('✅') ? 'bg-green-100 text-green-800 border border-green-300' : 
            status.includes('❌') ? 'bg-red-100 text-red-800 border border-red-300' : 
            'bg-blue-100 text-blue-800 border border-blue-300'}
        `}>
          {status}
        </div>
      )}
    </div>
  );
}

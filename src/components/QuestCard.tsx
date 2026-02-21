'use client';

import { useState } from 'react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { createUSDCTransfer, signAndSendTransaction } from '@/lib/solana/transaction';

export default function QuestCard({ quest }: { quest: any }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const completeQuest = async () => {
    if (!window.solana?.publicKey) {
      alert('Please connect wallet first');
      return;
    }

    setIsProcessing(true);
    
    try {
      const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC!);
      const userWallet = new PublicKey(window.solana.publicKey.toString());
      const platformWallet = new PublicKey(process.env.NEXT_PUBLIC_ADMIN_WALLET!);
      
      // Create USDC transfer (quest fee)
      const transaction = await createUSDCTransfer(
        connection,
        userWallet,
        platformWallet,
        quest.cost // USDC amount
      );
      
      // Sign and send
      const signature = await signAndSendTransaction(transaction, connection);
      
      // Verify on backend
      await fetch('/api/quests/complete', {
        method: 'POST',
        body: JSON.stringify({ 
          questId: quest.id, 
          signature,
          wallet: userWallet.toString() 
        }),
      });
      
      alert('Quest completed!');
    } catch (error) {
      console.error(error);
      alert('Transaction failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="quest-card">
      <h3>{quest.title}</h3>
      <p>Cost: {quest.cost} USDC</p>
      <button 
        onClick={completeQuest}
        disabled={isProcessing}
        className="btn-primary"
      >
        {isProcessing ? 'Processing...' : 'Complete Quest'}
      </button>
    </div>
  );
}
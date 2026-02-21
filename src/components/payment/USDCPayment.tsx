'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  hotel: any;
  onClose: () => void;
}

export const PaymentModal = ({ hotel, onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-nomad-card rounded-2xl p-6 max-w-md w-full border border-nomad-border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{hotel.name}</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <p className="text-nomad-gray mb-4">{hotel.location}</p>
        <div className="space-y-2 mb-6">
          <div className="flex justify-between">
            <span>Price</span>
            <span>${hotel.discountedPrice} USDC</span>
          </div>
          <div className="flex justify-between text-nomad-gray">
            <span>Platform Fee (10%)</span>
            <span>${(hotel.discountedPrice * 0.1).toFixed(2)} USDC</span>
          </div>
          <div className="flex justify-between text-nomad-gray">
            <span>Network Fee</span>
            <span>0.5 SOL</span>
          </div>
        </div>
        <button className="w-full py-3 bg-crypto-green text-nomad-dark rounded-lg font-medium">
          Pay with USDC
        </button>
      </div>
    </div>
  );
};
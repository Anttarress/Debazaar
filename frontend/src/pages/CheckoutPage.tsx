import React, { useState, useEffect } from 'react';
import { Listing } from '../types/telegram';
import { apiService } from '../services/api';
import { useTelegram } from '../hooks/useTelegram';

interface CheckoutPageProps {
  listing: Listing;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  listing,
  onNavigate,
  onBack,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'review' | 'processing' | 'success'>('review');
  const { user, showBackButton, hideBackButton, showMainButton, hideMainButton, hapticFeedback } = useTelegram();

  useEffect(() => {
    showBackButton(onBack);
    return () => hideBackButton();
  }, [onBack, showBackButton, hideBackButton]);

  useEffect(() => {
    if (step === 'review') {
      showMainButton('Confirm Purchase', handlePurchase);
    } else {
      hideMainButton();
    }
    return () => hideMainButton();
  }, [step, showMainButton, hideMainButton]);

  const handlePurchase = async () => {
    if (!user) {
      setError('Please authenticate with Telegram first');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setStep('processing');
      hapticFeedback('impact', 'medium');

      // Create order
      const orderData = {
        listing_id: listing.id,
        buyer_id: user.id.toString(),
        amount: listing.price,
        token_address: '0x1234567890123456789012345678901234567890',
      };

      const orderResponse = await apiService.createOrder(orderData);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock deposit
      const depositResponse = await apiService.mockDeposit(
        orderResponse.order_id,
        '0x' + user.id.toString().padStart(40, '0')
      );

      if (depositResponse.success) {
        setStep('success');
        hapticFeedback('notification', 'success');
        setTimeout(() => {
          onNavigate('order', { orderId: orderResponse.order_id });
        }, 2000);
      } else {
        throw new Error('Deposit failed');
      }
    } catch (error) {
      console.error('Error processing purchase:', error);
      setError(error instanceof Error ? error.message : 'Purchase failed');
      setStep('review');
      hapticFeedback('notification', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'processing') {
    return (
      <div className="text-center">
        <div className="loading">
          <div>
            <h2 className="text-xl font-bold mb-2">Processing Payment...</h2>
            <p>Please wait while we process your transaction</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="text-center">
        <div className="text-4xl mb-4">✅</div>
        <h2 className="text-xl font-bold mb-2">Payment Successful!</h2>
        <p className="mb-4">Your order has been created and payment is in escrow.</p>
        <p className="text-sm text-gray-600">Redirecting to order details...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {error && <div className="error">{error}</div>}

      <div className="card mb-4">
        <h3 className="font-semibold mb-3">Order Summary</h3>
        <div className="flex-between mb-4">
          <div>
            <h4 className="font-semibold">{listing.title}</h4>
            <p className="text-sm text-gray-600">by {listing.seller}</p>
          </div>
          <div className="text-xl font-bold text-blue-600">
            ${listing.price} {listing.currency}
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <h3 className="font-semibold mb-3">Payment Method</h3>
        <div className="border border-blue-600 rounded p-3 bg-blue-50">
          <div className="flex">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex-center mr-3">
              <span className="text-white text-sm font-bold">₮</span>
            </div>
            <div>
              <div className="font-semibold">Mock Wallet</div>
              <div className="text-sm text-gray-600">USDT Balance: $1,000.00</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <h3 className="font-semibold mb-3">Transaction Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex-between">
            <span className="text-gray-600">Item Price:</span>
            <span>${listing.price}</span>
          </div>
          <div className="flex-between">
            <span className="text-gray-600">Platform Fee:</span>
            <span>$0.00</span>
          </div>
          <div className="flex-between">
            <span className="text-gray-600">Network Fee:</span>
            <span>~$0.10</span>
          </div>
          <hr className="my-2" />
          <div className="flex-between font-semibold">
            <span>Total:</span>
            <span className="text-blue-600">${listing.price}</span>
          </div>
        </div>
      </div>

      <div className="success">
        <div className="flex">
          <div className="text-green-600 mr-2">🔒</div>
          <div>
            <div className="font-semibold mb-1">Escrow Protection Enabled</div>
            <div className="text-sm">
              Your payment will be held in escrow until you confirm delivery of the digital goods.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
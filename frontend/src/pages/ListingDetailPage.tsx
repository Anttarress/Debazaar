import React, { useState, useEffect } from 'react';
import { Listing } from '../types/telegram';
import { apiService } from '../services/api';
import { useTelegram } from '../hooks/useTelegram';

interface ListingDetailPageProps {
  listingId: number;
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export const ListingDetailPage: React.FC<ListingDetailPageProps> = ({
  listingId,
  onNavigate,
  onBack,
}) => {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showBackButton, hideBackButton, showMainButton, hideMainButton } = useTelegram();

  useEffect(() => {
    loadListing();
  }, [listingId]);

  useEffect(() => {
    showBackButton(onBack);
    return () => hideBackButton();
  }, [onBack, showBackButton, hideBackButton]);

  useEffect(() => {
    if (listing) {
      showMainButton(`Buy for $${listing.price}`, () => {
        onNavigate('checkout', { listing });
      });
    }
    return () => hideMainButton();
  }, [listing, onNavigate, showMainButton, hideMainButton]);

  const loadListing = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getListing(listingId);
      setListing(response);
    } catch (error) {
      console.error('Error loading listing:', error);
      setError('Failed to load listing');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading listing...</div>;
  }

  if (error || !listing) {
    return (
      <div className="text-center">
        <div className="error">{error || 'Listing not found'}</div>
        <button onClick={onBack} className="button">Go Back</button>
      </div>
    );
  }

  return (
    <div>
      <div className="card mb-4">
        <div className="flex-between mb-4">
          <h1 className="text-2xl font-bold">{listing.title}</h1>
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {listing.category}
          </span>
        </div>

        <div className="mb-4">
          <div className="text-3xl font-bold text-blue-600 mb-1">
            ${listing.price} {listing.currency}
          </div>
          <div className="text-sm text-gray-600">
            Token: {listing.metadata_cid ? 'USDT' : 'Mock Token'}
          </div>
        </div>

        {listing.description && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {listing.description}
            </p>
          </div>
        )}

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">Seller Information</h3>
          <div className="flex-between">
            <div>
              <div className="font-semibold">{listing.seller}</div>
              <div className="text-sm text-gray-600">
                ⭐ {listing.seller_rating.toFixed(1)} rating
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Listed {new Date(listing.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3">Purchase Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex-between">
            <span className="text-gray-600">Payment Method:</span>
            <span>Mock Wallet</span>
          </div>
          <div className="flex-between">
            <span className="text-gray-600">Escrow Protection:</span>
            <span className="text-green-600">✓ Enabled</span>
          </div>
          <div className="flex-between">
            <span className="text-gray-600">Delivery:</span>
            <span>Digital Download</span>
          </div>
        </div>
      </div>
    </div>
  );
};
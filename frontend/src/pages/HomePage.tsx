import React, { useState, useEffect } from 'react';
import { ListingCard } from '../components/ListingCard';
import { Listing } from '../types/telegram';
import { apiService } from '../services/api';
import { useTelegram } from '../hooks/useTelegram';

interface HomePageProps {
  onNavigate: (page: string, data?: any) => void;
  onBack: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onBack }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showMainButton, hideMainButton } = useTelegram();

  useEffect(() => {
    loadListings();
    showMainButton('+ Create Listing', () => onNavigate('create'));
    return () => hideMainButton();
  }, [onNavigate, showMainButton, hideMainButton]);

  const loadListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getListings();
      setListings(response.listings);
    } catch (error) {
      console.error('Error loading listings:', error);
      setError('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleListingClick = (listing: Listing) => {
    onNavigate('listing', { listingId: listing.id });
  };

  if (loading) {
    return <div className="loading">Loading listings...</div>;
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="error">{error}</div>
        <button onClick={loadListings} className="button">Retry</button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Crypto Marketplace</h1>
        <p className="text-gray-600">Buy and sell digital goods with crypto</p>
      </div>

      {listings.length === 0 ? (
        <div className="text-center">
          <div className="text-4xl mb-4">🛍️</div>
          <h3 className="text-xl font-bold mb-2">No Products Yet</h3>
          <p className="mb-6">Be the first to share your digital products</p>
          <button onClick={() => onNavigate('create')} className="button">
            Create First Listing
          </button>
        </div>
      ) : (
        <div>
          <div className="card mb-4">
            <div className="flex-between">
              <div>
                <div className="text-2xl font-bold">{listings.length}</div>
                <div className="text-sm text-gray-600">Products Available</div>
              </div>
              <div className="text-2xl">🚀</div>
            </div>
          </div>

          <div className="grid grid-2">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onClick={handleListingClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
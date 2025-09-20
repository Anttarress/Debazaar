import React, { useState } from 'react';
import { Listing } from '../types/telegram';

interface ListingCardProps {
  listing: Listing;
  onClick: (listing: Listing) => void;
}

const categoryIcons: { [key: string]: string } = {
  templates: '🎨',
  graphics: '🖼️',
  photos: '📸',
  videos: '🎥',
  audio: '🎵',
  fonts: '✏️',
  ebooks: '📚',
  courses: '🎓',
  software: '💻',
  other: '📦',
};

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    onClick(listing);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="card cursor-pointer" onClick={handleClick}>
      <div className="mb-2">
        {listing.image_url && !imageError ? (
          <img
            src={listing.image_url}
            alt={listing.title}
            className="w-full h-32 object-cover rounded"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-32 bg-gray-200 rounded flex-center">
            <div className="text-center">
              <div className="text-2xl mb-1">
                {categoryIcons[listing.category] || '📦'}
              </div>
              <div className="text-sm text-gray-600 capitalize">
                {listing.category}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-2">
        <h3 className="font-semibold text-lg mb-1">{listing.title}</h3>
        {listing.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
        )}
      </div>

      <div className="flex-between">
        <div className="flex">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex-center mr-2">
            <span className="text-xs text-white font-bold">
              {listing.seller.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="text-sm font-semibold">{listing.seller}</div>
            <div className="text-xs text-gray-600">
              ⭐ {typeof listing.seller_rating === 'number' ? listing.seller_rating.toFixed(1) : listing.seller_rating}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-lg font-bold text-blue-600">
            ${listing.price}
          </div>
          <div className="text-xs text-gray-600">
            {new Date(listing.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
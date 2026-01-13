import React from 'react';
import { Home, Bed, Bath, Maximize, Heart } from 'lucide-react';

const PropertyCard = ({ property, onClick, showSaveButton, isSaved, onToggleSave }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div
      onClick={onClick}
      className="rounded-xl overflow-hidden bg-brand-gray border border-brand-border touch-feedback cursor-pointer"
    >
      {/* Property Image Placeholder */}
      <div className="h-32 gold-gradient opacity-30 flex items-center justify-center relative">
        <Home className="w-12 h-12 text-brand-dark" />
        {showSaveButton && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave?.();
            }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-brand-dark/80 flex items-center justify-center touch-feedback"
          >
            <Heart
              className="w-4 h-4"
              fill={isSaved ? '#c9a96e' : 'none'}
              stroke={isSaved ? '#c9a96e' : '#ffffff'}
            />
          </button>
        )}
      </div>

      {/* Property Details */}
      <div className="p-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-semibold text-white truncate">
              {property.address}
            </h3>
            <p className="text-xs text-brand-text">{property.neighborhood}</p>
          </div>
          <p className="font-display text-lg font-semibold text-brand-gold ml-2 flex-shrink-0">
            {formatPrice(property.price)}
          </p>
        </div>

        <div className="flex gap-3 mt-2 text-xs text-brand-text-light">
          <span className="flex items-center gap-1">
            <Bed className="w-3 h-3" /> {property.beds}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-3 h-3" /> {property.baths}
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="w-3 h-3" /> {property.sqft.toLocaleString()} sqft
          </span>
        </div>

        {property.highlights && (
          <div className="mt-3 pt-3 border-t border-brand-border">
            <p className="text-xs text-brand-text line-clamp-2">
              <strong className="text-brand-gold">Highlights:</strong> {property.highlights}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;

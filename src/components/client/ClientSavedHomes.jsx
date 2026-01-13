import React from 'react';
import { Heart } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import usePropertyStore from '../../store/usePropertyStore';
import PropertyCard from '../PropertyCard';

const ClientSavedHomes = () => {
  const { user } = useAuthStore();
  const { getSavedProperties, toggleSavedProperty } = usePropertyStore();

  const savedProperties = getSavedProperties(user?.id);

  const handleToggleSave = (propertyId) => {
    toggleSavedProperty(user?.id, propertyId);
  };

  if (savedProperties.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <Heart className="w-16 h-16 text-brand-gold mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-white mb-2">No Saved Homes</h3>
          <p className="text-sm text-brand-text">
            Your favorite properties will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-4 space-y-4">
      <div className="mb-4">
        <h2 className="font-display text-2xl font-semibold text-white mb-2">Saved Homes</h2>
        <p className="text-sm text-brand-text">Your favorite properties ({savedProperties.length})</p>
      </div>

      <div className="space-y-4">
        {savedProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            showSaveButton={true}
            isSaved={true}
            onToggleSave={() => handleToggleSave(property.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ClientSavedHomes;

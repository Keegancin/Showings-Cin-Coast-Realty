import React from 'react';
import useAuthStore from '../../store/useAuthStore';
import usePropertyStore from '../../store/usePropertyStore';
import PropertyCard from '../PropertyCard';

const ClientProperties = () => {
  const { user } = useAuthStore();
  const { properties, toggleSavedProperty, isPropertySaved } = usePropertyStore();

  const handleToggleSave = (propertyId) => {
    toggleSavedProperty(user?.id, propertyId);
  };

  return (
    <div className="px-4 pt-6 pb-4 space-y-4">
      <div className="mb-4">
        <h2 className="font-display text-2xl font-semibold text-white mb-2">Available Homes</h2>
        <p className="text-sm text-brand-text">Tap the heart icon to save your favorites</p>
      </div>

      <div className="space-y-4">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            showSaveButton={true}
            isSaved={isPropertySaved(user?.id, property.id)}
            onToggleSave={() => handleToggleSave(property.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ClientProperties;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus } from 'lucide-react';
import usePropertyStore from '../../store/usePropertyStore';
import PropertyCard from '../PropertyCard';

const AgentProperties = () => {
  const navigate = useNavigate();
  const { properties } = usePropertyStore();

  if (properties.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-brand-gold mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-white mb-2">No Properties Yet</h3>
          <p className="text-sm text-brand-text mb-4">
            Add your first property listing
          </p>
          <button
            onClick={() => navigate('/agent/properties/new')}
            className="px-6 py-3 gold-gradient text-brand-dark font-medium rounded-lg touch-feedback"
          >
            Add Property
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-white">Properties</h2>
          <p className="text-sm text-brand-text">{properties.length} listings</p>
        </div>
        <button
          onClick={() => navigate('/agent/properties/new')}
          className="p-3 rounded-lg gold-gradient text-brand-dark touch-feedback"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default AgentProperties;

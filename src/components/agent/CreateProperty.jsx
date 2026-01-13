import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import usePropertyStore from '../../store/usePropertyStore';

const CreateProperty = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addProperty } = usePropertyStore();

  const [formData, setFormData] = useState({
    address: '',
    neighborhood: '',
    price: '',
    beds: '',
    baths: '',
    sqft: '',
    highlights: '',
    mlsNumber: ''
  });

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const propertyData = {
      ...formData,
      price: parseFloat(formData.price),
      beds: parseInt(formData.beds),
      baths: parseFloat(formData.baths),
      sqft: parseInt(formData.sqft)
    };

    const result = addProperty(propertyData, user?.id);

    if (result.success) {
      navigate('/agent/properties');
    } else {
      setError('Failed to create property');
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/agent/properties')}
          className="p-2 rounded-lg bg-brand-gray border border-brand-border touch-feedback"
        >
          <ArrowLeft className="w-5 h-5 text-brand-gold" />
        </button>
        <h2 className="font-display text-2xl font-semibold text-white">New Property</h2>
      </div>

      <div className="mb-4 p-3 rounded-lg bg-brand-gold/10 border border-brand-gold/50">
        <p className="text-xs text-brand-gold">
          💡 In production, this would integrate with IDX APIs to automatically fetch property details, photos, and MLS data
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="mlsNumber" className="block text-xs uppercase tracking-wider text-brand-text mb-2">
            MLS Number (Optional)
          </label>
          <input
            id="mlsNumber"
            type="text"
            value={formData.mlsNumber}
            onChange={(e) => handleChange('mlsNumber', e.target.value)}
            className="w-full bg-brand-gray border border-brand-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
            placeholder="MLS12345"
          />
          <p className="text-xs text-brand-text mt-1">Would fetch details from IDX if provided</p>
        </div>

        <div>
          <label htmlFor="address" className="block text-xs uppercase tracking-wider text-brand-text mb-2">
            Street Address *
          </label>
          <input
            id="address"
            type="text"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full bg-brand-gray border border-brand-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
            placeholder="123 Main Street"
            required
          />
        </div>

        <div>
          <label htmlFor="neighborhood" className="block text-xs uppercase tracking-wider text-brand-text mb-2">
            Neighborhood *
          </label>
          <input
            id="neighborhood"
            type="text"
            value={formData.neighborhood}
            onChange={(e) => handleChange('neighborhood', e.target.value)}
            className="w-full bg-brand-gray border border-brand-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
            placeholder="Downtown District"
            required
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-xs uppercase tracking-wider text-brand-text mb-2">
            Price *
          </label>
          <input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            className="w-full bg-brand-gray border border-brand-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
            placeholder="725000"
            min="0"
            step="1000"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor="beds" className="block text-xs uppercase tracking-wider text-brand-text mb-2">
              Beds *
            </label>
            <input
              id="beds"
              type="number"
              value={formData.beds}
              onChange={(e) => handleChange('beds', e.target.value)}
              className="w-full bg-brand-gray border border-brand-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
              placeholder="4"
              min="0"
              required
            />
          </div>

          <div>
            <label htmlFor="baths" className="block text-xs uppercase tracking-wider text-brand-text mb-2">
              Baths *
            </label>
            <input
              id="baths"
              type="number"
              value={formData.baths}
              onChange={(e) => handleChange('baths', e.target.value)}
              className="w-full bg-brand-gray border border-brand-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
              placeholder="3"
              min="0"
              step="0.5"
              required
            />
          </div>

          <div>
            <label htmlFor="sqft" className="block text-xs uppercase tracking-wider text-brand-text mb-2">
              Sq Ft *
            </label>
            <input
              id="sqft"
              type="number"
              value={formData.sqft}
              onChange={(e) => handleChange('sqft', e.target.value)}
              className="w-full bg-brand-gray border border-brand-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
              placeholder="2450"
              min="0"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="highlights" className="block text-xs uppercase tracking-wider text-brand-text mb-2">
            Highlights
          </label>
          <textarea
            id="highlights"
            value={formData.highlights}
            onChange={(e) => handleChange('highlights', e.target.value)}
            className="w-full bg-brand-gray border border-brand-border rounded-lg px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-brand-gold transition-colors"
            rows="3"
            placeholder="Updated kitchen, large backyard, close to schools..."
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full gold-gradient text-brand-dark font-medium py-3 rounded-lg flex items-center justify-center gap-2 touch-feedback disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Adding Property...' : 'Add Property'}
        </button>
      </form>
    </div>
  );
};

export default CreateProperty;

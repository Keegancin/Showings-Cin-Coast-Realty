import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const CreateClient = () => {
  const navigate = useNavigate();
  const { user, createClient } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: 'client123' // Default password
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const result = createClient(formData);

    if (result.success) {
      navigate('/agent/clients');
    } else {
      setError(result.error);
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
          onClick={() => navigate('/agent/clients')}
          className="p-2 rounded-lg bg-brand-gray border border-brand-border touch-feedback"
        >
          <ArrowLeft className="w-5 h-5 text-brand-gold" />
        </button>
        <h2 className="font-display text-2xl font-semibold text-white">New Client</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-xs uppercase tracking-wider text-brand-text mb-2">
            Full Name *
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full bg-brand-gray border border-brand-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs uppercase tracking-wider text-brand-text mb-2">
            Email *
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full bg-brand-gray border border-brand-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
            placeholder="john@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs uppercase tracking-wider text-brand-text mb-2">
            Phone Number *
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full bg-brand-gray border border-brand-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
            placeholder="(555) 123-4567"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs uppercase tracking-wider text-brand-text mb-2">
            Initial Password
          </label>
          <input
            id="password"
            type="text"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className="w-full bg-brand-gray border border-brand-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
            placeholder="Set initial password"
            required
          />
          <p className="text-xs text-brand-text mt-1">Client can change this after first login</p>
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
          {saving ? 'Creating...' : 'Create Client'}
        </button>
      </form>
    </div>
  );
};

export default CreateClient;

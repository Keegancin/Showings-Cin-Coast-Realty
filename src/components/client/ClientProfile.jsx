import React, { useState } from 'react';
import { User, Save, Camera } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const ClientProfile = () => {
  const { user, updateProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const result = updateProfile(formData);

    if (result.success) {
      setMessage('Profile updated successfully!');
    } else {
      setMessage('Failed to update profile');
    }

    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="px-4 pt-6 pb-4 space-y-6">
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full gold-gradient flex items-center justify-center">
            {user?.profilePhoto ? (
              <img src={user.profilePhoto} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-brand-dark" />
            )}
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-brand-gold text-brand-dark flex items-center justify-center touch-feedback">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-brand-text mt-2">Tap to change photo</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-xs uppercase tracking-wider text-brand-text mb-2">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full bg-brand-gray border border-brand-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs uppercase tracking-wider text-brand-text mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full bg-brand-gray border border-brand-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs uppercase tracking-wider text-brand-text mb-2">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full bg-brand-gray border border-brand-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
            required
          />
        </div>

        {message && (
          <div className={`rounded-lg p-3 ${message.includes('success') ? 'bg-green-500/10 border border-green-500/50' : 'bg-red-500/10 border border-red-500/50'}`}>
            <p className={`text-xs ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full gold-gradient text-brand-dark font-medium py-3 rounded-lg flex items-center justify-center gap-2 touch-feedback disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ClientProfile;

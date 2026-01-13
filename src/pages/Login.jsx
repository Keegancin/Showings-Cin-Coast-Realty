import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full gold-gradient flex items-center justify-center">
            <Home className="w-10 h-10 text-brand-dark" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-white mb-2">
            Cin Coast Realty
          </h1>
          <p className="text-brand-text text-sm tracking-wider uppercase">
            Showings Management
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-brand-gray border border-brand-border rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-wider text-brand-text mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs uppercase tracking-wider text-brand-text mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full gold-gradient text-brand-dark font-medium py-3 rounded-lg transition-all touch-feedback disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-brand-border">
            <p className="text-xs uppercase tracking-wider text-brand-text mb-3">Demo Accounts:</p>
            <div className="space-y-2 text-xs text-brand-text-light">
              <div className="bg-brand-dark rounded p-2">
                <p className="text-brand-gold mb-1">Team Lead:</p>
                <p>lead@cincoast.com / lead123</p>
              </div>
              <div className="bg-brand-dark rounded p-2">
                <p className="text-brand-gold mb-1">Agent:</p>
                <p>agent@cincoast.com / agent123</p>
              </div>
              <div className="bg-brand-dark rounded p-2">
                <p className="text-brand-gold mb-1">Client:</p>
                <p>client@example.com / client123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

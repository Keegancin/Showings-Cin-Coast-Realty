import React, { useEffect, useState } from 'react';
import {
  RefreshCw, Search, MessageSquare, AlertCircle,
  CheckCircle2, Clock,
} from 'lucide-react';
import useStore from './store/useStore';
import LeadCard from './components/LeadCard';
import SettingsPanel from './components/SettingsPanel';

function timeAgo(ms) {
  const diff = Math.floor((Date.now() - ms) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

const FILTERS = ['all', 'pending', 'responded'];

export default function App() {
  const {
    leads, loading, error, lastFetched,
    responded, fetchLeads,
  } = useStore();

  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (leads.length === 0) fetchLeads();
  }, []);

  const pendingCount = leads.filter((p) => !responded.includes(p.id)).length;
  const respondedCount = leads.length - pendingCount;

  const visible = leads.filter((post) => {
    if (filter === 'pending' && responded.includes(post.id)) return false;
    if (filter === 'responded' && !responded.includes(post.id)) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.subreddit.toLowerCase().includes(q) ||
        post.body.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-brand-dark text-brand-text">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 bg-brand-dark/95 backdrop-blur border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-base font-bold text-brand-text">
              Reddit Lead Monitor
            </h1>
            <p className="text-xs text-brand-gold">Cin Coast Realty</p>
          </div>

          <button
            onClick={fetchLeads}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              loading
                ? 'bg-brand-surface text-brand-muted cursor-not-allowed'
                : 'bg-brand-gold hover:bg-brand-gold/90 text-brand-dark'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Fetching…' : 'Refresh'}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        {/* ── Stats ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-brand-surface border border-brand-border rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-brand-text">{leads.length}</p>
            <p className="text-xs text-brand-muted mt-0.5">Total Posts</p>
          </div>
          <div className="bg-brand-surface border border-brand-border rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-brand-gold">{pendingCount}</p>
            <p className="text-xs text-brand-muted mt-0.5">Pending</p>
          </div>
          <div className="bg-brand-surface border border-brand-border rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-emerald-400">{respondedCount}</p>
            <p className="text-xs text-brand-muted mt-0.5">Responded</p>
          </div>
        </div>

        {/* Last updated */}
        {lastFetched && (
          <p className="text-xs text-brand-muted flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            Last refreshed {timeAgo(lastFetched)}
          </p>
        )}

        {/* ── Settings ───────────────────────────────────────────────────── */}
        <SettingsPanel />

        {/* ── Search + Filter ────────────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts…"
              className="w-full bg-brand-surface border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-brand-text focus:outline-none focus:border-brand-gold transition-colors"
            />
          </div>

          <div className="flex gap-1 p-1 bg-brand-surface rounded-xl border border-brand-border">
            {FILTERS.map((f) => {
              const count =
                f === 'all' ? leads.length
                : f === 'pending' ? pendingCount
                : respondedCount;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    filter === f
                      ? 'bg-brand-gold text-brand-dark'
                      : 'text-brand-muted hover:text-brand-text'
                  }`}
                >
                  {f} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Error ─────────────────────────────────────────────────────── */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-950 border border-red-800 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-400">Failed to fetch Reddit posts</p>
              <p className="text-xs text-red-400/70 mt-1">{error}</p>
              <p className="text-xs text-red-400/50 mt-1">
                Reddit may be rate-limiting requests. Wait a moment and try again.
              </p>
            </div>
          </div>
        )}

        {/* ── Loading skeletons ──────────────────────────────────────────── */}
        {loading && leads.length === 0 && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-brand-surface border border-brand-border rounded-xl p-4 animate-pulse"
              >
                <div className="h-3 bg-brand-border rounded-full w-24 mb-3" />
                <div className="h-4 bg-brand-border rounded-full w-full mb-2" />
                <div className="h-4 bg-brand-border rounded-full w-3/4 mb-3" />
                <div className="h-3 bg-brand-border rounded-full w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* ── Empty state ───────────────────────────────────────────────── */}
        {!loading && visible.length === 0 && !error && (
          <div className="text-center py-16">
            <MessageSquare className="w-14 h-14 text-brand-border mx-auto mb-4" />
            <p className="text-brand-muted font-medium">
              {leads.length === 0
                ? 'Hit Refresh to pull Reddit posts'
                : 'No posts match the current filter'}
            </p>
            {leads.length === 0 && (
              <p className="text-xs text-brand-muted mt-2">
                Searches subreddits like r/RealEstate, r/cincinnati, r/FirstTimeHomeBuyer and more
              </p>
            )}
          </div>
        )}

        {/* ── Lead cards ────────────────────────────────────────────────── */}
        <div className="space-y-4">
          {visible.map((post) => (
            <LeadCard key={post.id} post={post} />
          ))}
        </div>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        {visible.length > 0 && (
          <p className="text-center text-xs text-brand-muted py-4">
            Showing {visible.length} of {leads.length} posts
          </p>
        )}
      </main>
    </div>
  );
}

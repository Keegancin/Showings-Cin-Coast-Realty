import React, { useEffect, useState, useCallback } from 'react';
import {
  RefreshCw, ExternalLink, Wand2, Copy, CheckCheck,
  ChevronDown, ChevronUp, Settings, MapPin, Search,
  MessageSquare, ArrowUpCircle, Clock, AlertCircle,
  Eye, EyeOff, KeyRound,
} from 'lucide-react';
import useRedditStore from '../../store/useRedditStore';
import useAuthStore from '../../store/useAuthStore';
import { DEFAULT_SUBREDDITS, DEFAULT_KEYWORDS } from '../../services/redditService';

// ── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(utcSeconds) {
  const diff = Date.now() / 1000 - utcSeconds;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ── Settings Panel ────────────────────────────────────────────────────────────

function SettingsPanel({ settings, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [cityInput, setCityInput] = useState(settings.cities.join(', '));
  const [kwInput, setKwInput] = useState(settings.keywords.join(', '));
  const [subInput, setSubInput] = useState(settings.subreddits.join(', '));
  const [apiKey, setApiKey] = useState(
    import.meta.env.VITE_ANTHROPIC_API_KEY ? '••••••••••••••••' : ''
  );
  const [showKey, setShowKey] = useState(false);
  const hasApiKey = !!import.meta.env.VITE_ANTHROPIC_API_KEY;

  const save = () => {
    onUpdate({
      cities: cityInput.split(',').map((s) => s.trim()).filter(Boolean),
      keywords: kwInput.split(',').map((s) => s.trim()).filter(Boolean),
      subreddits: subInput.split(',').map((s) => s.trim()).filter(Boolean),
    });
    setOpen(false);
  };

  return (
    <div className="border border-brand-border rounded-xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 bg-brand-gray touch-feedback"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-brand-gold" />
          <span className="text-sm font-medium text-brand-text">Monitor Settings</span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-brand-muted" />
        ) : (
          <ChevronDown className="w-4 h-4 text-brand-muted" />
        )}
      </button>

      {open && (
        <div className="p-3 bg-brand-dark space-y-3 border-t border-brand-border">
          {/* API Key status */}
          <div
            className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
              hasApiKey
                ? 'bg-green-900/30 text-green-400'
                : 'bg-yellow-900/30 text-yellow-400'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 flex-shrink-0" />
            {hasApiKey
              ? 'Claude API key configured — draft generation enabled'
              : 'Add VITE_ANTHROPIC_API_KEY to .env to enable AI draft generation'}
          </div>

          <div>
            <label className="block text-xs text-brand-muted mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Target Cities (comma-separated)
            </label>
            <input
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              className="w-full bg-brand-gray border border-brand-border rounded-lg px-3 py-1.5 text-xs text-brand-text focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div>
            <label className="block text-xs text-brand-muted mb-1 flex items-center gap-1">
              <Search className="w-3 h-3" /> Keywords (comma-separated)
            </label>
            <textarea
              value={kwInput}
              onChange={(e) => setKwInput(e.target.value)}
              rows={2}
              className="w-full bg-brand-gray border border-brand-border rounded-lg px-3 py-1.5 text-xs text-brand-text focus:outline-none focus:border-brand-gold resize-none"
            />
          </div>

          <div>
            <label className="block text-xs text-brand-muted mb-1">
              Subreddits (comma-separated, no r/)
            </label>
            <textarea
              value={subInput}
              onChange={(e) => setSubInput(e.target.value)}
              rows={2}
              className="w-full bg-brand-gray border border-brand-border rounded-lg px-3 py-1.5 text-xs text-brand-text focus:outline-none focus:border-brand-gold resize-none"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={settings.timeFilter}
              onChange={(e) => onUpdate({ timeFilter: e.target.value })}
              className="bg-brand-gray border border-brand-border rounded-lg px-2 py-1.5 text-xs text-brand-text focus:outline-none focus:border-brand-gold flex-1"
            >
              <option value="day">Past day</option>
              <option value="week">Past week</option>
              <option value="month">Past month</option>
            </select>
            <button
              onClick={save}
              className="flex-1 bg-brand-gold text-brand-dark text-xs font-semibold py-1.5 rounded-lg touch-feedback"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Lead Card ────────────────────────────────────────────────────────────────

function LeadCard({ post, teamInfo }) {
  const {
    drafts,
    editedDrafts,
    generatingDraft,
    draftErrors,
    responded,
    generateDraftForPost,
    updateEditedDraft,
    markResponded,
    clearDraft,
  } = useRedditStore();

  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDraft, setShowDraft] = useState(true);

  const draft = drafts[post.id] || '';
  const editedDraft = editedDrafts[post.id] ?? draft;
  const isGenerating = generatingDraft[post.id] || false;
  const error = draftErrors[post.id];
  const isResponded = responded.includes(post.id);
  const hasDraft = !!drafts[post.id];

  const handleCopy = useCallback(() => {
    const text = editedDraft || draft;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [editedDraft, draft]);

  const truncatedBody = post.body.length > 200
    ? post.body.slice(0, 200) + '…'
    : post.body;

  return (
    <div
      className={`border rounded-xl overflow-hidden mb-3 transition-all ${
        isResponded
          ? 'border-green-800 opacity-60'
          : 'border-brand-border'
      }`}
    >
      {/* Header */}
      <div className="p-3 bg-brand-gray">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className="text-[10px] font-bold text-brand-gold bg-brand-gold/10 px-1.5 py-0.5 rounded">
                r/{post.subreddit}
              </span>
              {post.flair && (
                <span className="text-[10px] text-brand-muted border border-brand-border px-1.5 py-0.5 rounded">
                  {post.flair}
                </span>
              )}
              {isResponded && (
                <span className="text-[10px] text-green-400 border border-green-800 px-1.5 py-0.5 rounded">
                  Responded
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-brand-text leading-snug line-clamp-2">
              {post.title}
            </p>
          </div>
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 p-1.5 rounded-lg bg-brand-dark border border-brand-border touch-feedback"
          >
            <ExternalLink className="w-3.5 h-3.5 text-brand-muted" />
          </a>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 mt-2 text-[10px] text-brand-muted">
          <span className="flex items-center gap-1">
            <ArrowUpCircle className="w-3 h-3" /> {post.score}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" /> {post.numComments}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {timeAgo(post.created)}
          </span>
          <span className="text-brand-muted/60">u/{post.author}</span>
        </div>

        {/* Body preview */}
        {post.body && (
          <div className="mt-2">
            <p className="text-xs text-brand-muted leading-relaxed">
              {expanded ? post.body : truncatedBody}
            </p>
            {post.body.length > 200 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-[10px] text-brand-gold mt-1 touch-feedback"
              >
                {expanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-3 py-2 bg-brand-dark border-t border-brand-border flex gap-2 flex-wrap">
        <button
          onClick={() => generateDraftForPost(post, teamInfo)}
          disabled={isGenerating}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold touch-feedback ${
            isGenerating
              ? 'bg-brand-gray text-brand-muted cursor-not-allowed'
              : 'bg-brand-gold text-brand-dark'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          {isGenerating ? 'Generating…' : hasDraft ? 'Regenerate' : 'Generate Draft'}
        </button>

        {hasDraft && (
          <>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-gray border border-brand-border text-brand-text touch-feedback"
            >
              {copied ? (
                <CheckCheck className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? 'Copied!' : 'Copy'}
            </button>

            <button
              onClick={() => setShowDraft(!showDraft)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-brand-gray border border-brand-border text-brand-muted touch-feedback"
            >
              {showDraft ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </>
        )}

        <button
          onClick={() => markResponded(post.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border touch-feedback ml-auto ${
            isResponded
              ? 'bg-green-900/30 border-green-800 text-green-400'
              : 'bg-brand-gray border-brand-border text-brand-muted'
          }`}
        >
          <CheckCheck className="w-3.5 h-3.5" />
          {isResponded ? 'Done' : 'Mark Done'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="px-3 py-2 bg-red-900/20 border-t border-red-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-400 leading-relaxed">{error}</p>
        </div>
      )}

      {/* Draft area */}
      {hasDraft && showDraft && (
        <div className="p-3 bg-brand-dark border-t border-brand-border">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold text-brand-gold uppercase tracking-wide">
              AI Draft — Review & Edit Before Posting
            </span>
            {isGenerating && (
              <span className="text-[10px] text-brand-muted animate-pulse">streaming…</span>
            )}
          </div>
          <textarea
            value={editedDraft}
            onChange={(e) => updateEditedDraft(post.id, e.target.value)}
            rows={8}
            className="w-full bg-brand-gray border border-brand-border rounded-lg px-3 py-2 text-xs text-brand-text leading-relaxed focus:outline-none focus:border-brand-gold resize-y"
            placeholder="Draft will appear here…"
          />
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[10px] text-brand-muted">
              {(editedDraft || '').split(/\s+/).filter(Boolean).length} words
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[10px] text-brand-gold touch-feedback"
            >
              {copied ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy to clipboard'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

const RedditLeadMonitor = () => {
  const {
    leads, isLoadingLeads, leadsError, lastFetched,
    responded, settings, fetchLeads, updateSettings,
  } = useRedditStore();

  const { user } = useAuthStore();

  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'done'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (leads.length === 0) fetchLeads();
  }, []);

  const teamInfo = {
    name: user?.name || 'Keegan',
    title: user?.title || 'Team Lead & Luxury Specialist',
    bio: user?.bio || '',
  };

  const filteredLeads = leads.filter((post) => {
    if (filter === 'pending' && responded.includes(post.id)) return false;
    if (filter === 'done' && !responded.includes(post.id)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.subreddit.toLowerCase().includes(q) ||
        post.body.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = leads.filter((p) => !responded.includes(p.id)).length;

  return (
    <div className="flex flex-col h-full">
      {/* Sticky header */}
      <div className="flex-shrink-0 px-4 pt-2 pb-3 space-y-3">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-brand-gray border border-brand-border rounded-xl p-2 text-center">
            <p className="text-lg font-bold text-brand-text">{leads.length}</p>
            <p className="text-[9px] text-brand-muted">Total Leads</p>
          </div>
          <div className="bg-brand-gray border border-brand-border rounded-xl p-2 text-center">
            <p className="text-lg font-bold text-brand-gold">{pendingCount}</p>
            <p className="text-[9px] text-brand-muted">Pending</p>
          </div>
          <div className="bg-brand-gray border border-brand-border rounded-xl p-2 text-center">
            <p className="text-lg font-bold text-green-400">
              {leads.length - pendingCount}
            </p>
            <p className="text-[9px] text-brand-muted">Responded</p>
          </div>
        </div>

        {/* Refresh + last fetched */}
        <div className="flex items-center gap-2">
          <button
            onClick={fetchLeads}
            disabled={isLoadingLeads}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold touch-feedback flex-1 justify-center ${
              isLoadingLeads
                ? 'bg-brand-gray text-brand-muted cursor-not-allowed'
                : 'bg-brand-gold text-brand-dark'
            }`}
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoadingLeads ? 'animate-spin' : ''}`}
            />
            {isLoadingLeads ? 'Fetching Reddit…' : 'Refresh Leads'}
          </button>
          {lastFetched && (
            <span className="text-[10px] text-brand-muted">
              Updated {timeAgo(lastFetched / 1000)}
            </span>
          )}
        </div>

        {/* Settings */}
        <SettingsPanel settings={settings} onUpdate={updateSettings} />

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads…"
            className="w-full bg-brand-gray border border-brand-border rounded-xl pl-8 pr-3 py-2 text-xs text-brand-text focus:outline-none focus:border-brand-gold"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-brand-gray rounded-xl p-1">
          {[
            { id: 'all', label: `All (${leads.length})` },
            { id: 'pending', label: `Pending (${pendingCount})` },
            { id: 'done', label: `Done (${leads.length - pendingCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all touch-feedback ${
                filter === tab.id
                  ? 'bg-brand-gold text-brand-dark'
                  : 'text-brand-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable leads list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Error */}
        {leadsError && (
          <div className="flex items-start gap-2 p-3 bg-red-900/20 border border-red-800 rounded-xl mb-3">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-red-400 font-medium">Failed to fetch Reddit posts</p>
              <p className="text-[10px] text-red-400/70 mt-0.5">{leadsError}</p>
              <p className="text-[10px] text-red-400/50 mt-1">
                Reddit may be rate-limiting requests. Try again in a moment.
              </p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isLoadingLeads && filteredLeads.length === 0 && !leadsError && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-brand-muted mx-auto mb-3 opacity-30" />
            <p className="text-sm text-brand-muted">
              {leads.length === 0
                ? 'Hit "Refresh Leads" to fetch Reddit posts'
                : 'No leads match the current filter'}
            </p>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoadingLeads && leads.length === 0 && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-brand-border rounded-xl p-3 bg-brand-gray animate-pulse"
              >
                <div className="h-3 bg-brand-border rounded w-1/3 mb-2" />
                <div className="h-4 bg-brand-border rounded w-full mb-1" />
                <div className="h-4 bg-brand-border rounded w-3/4" />
              </div>
            ))}
          </div>
        )}

        {/* Lead cards */}
        {filteredLeads.map((post) => (
          <LeadCard key={post.id} post={post} teamInfo={teamInfo} />
        ))}
      </div>
    </div>
  );
};

export default RedditLeadMonitor;

import React, { useState } from 'react';
import { Settings, ChevronDown, ChevronUp, MapPin, Search, User, KeyRound } from 'lucide-react';
import useStore from '../store/useStore';

export default function SettingsPanel() {
  const { settings, updateSettings } = useStore();
  const [open, setOpen] = useState(false);

  const [cities, setCities] = useState(settings.cities.join(', '));
  const [keywords, setKeywords] = useState(settings.keywords.join(', '));
  const [subreddits, setSubreddits] = useState(settings.subreddits.join(', '));
  const [teamName, setTeamName] = useState(settings.teamName);
  const [teamTitle, setTeamTitle] = useState(settings.teamTitle);
  const [teamBio, setTeamBio] = useState(settings.teamBio);
  const [timeFilter, setTimeFilter] = useState(settings.timeFilter);

  const hasApiKey = !!import.meta.env.VITE_ANTHROPIC_API_KEY;

  const save = () => {
    updateSettings({
      cities: cities.split(',').map((s) => s.trim()).filter(Boolean),
      keywords: keywords.split(',').map((s) => s.trim()).filter(Boolean),
      subreddits: subreddits.split(',').map((s) => s.trim()).filter(Boolean),
      teamName,
      teamTitle,
      teamBio,
      timeFilter,
    });
    setOpen(false);
  };

  return (
    <div className="border border-brand-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-brand-surface hover:bg-brand-card transition-colors"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-brand-gold" />
          <span className="text-sm font-medium text-brand-text">Settings</span>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-brand-muted" />
          : <ChevronDown className="w-4 h-4 text-brand-muted" />}
      </button>

      {open && (
        <div className="p-4 border-t border-brand-border bg-brand-dark space-y-4">
          {/* API key status */}
          <div className={`flex items-start gap-2.5 p-3 rounded-lg text-xs leading-relaxed ${
            hasApiKey
              ? 'bg-emerald-950 border border-emerald-800 text-emerald-400'
              : 'bg-amber-950 border border-amber-800 text-amber-400'
          }`}>
            <KeyRound className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            {hasApiKey
              ? 'Claude API key detected — AI draft generation is enabled.'
              : 'No Claude API key found. Copy .env.example → .env and add VITE_ANTHROPIC_API_KEY to enable draft generation.'}
          </div>

          {/* Team info */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-brand-gold uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3 h-3" /> Team Info
            </p>
            <input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Team lead name"
              className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-text focus:outline-none focus:border-brand-gold"
            />
            <input
              value={teamTitle}
              onChange={(e) => setTeamTitle(e.target.value)}
              placeholder="Title"
              className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-text focus:outline-none focus:border-brand-gold"
            />
            <textarea
              value={teamBio}
              onChange={(e) => setTeamBio(e.target.value)}
              placeholder="Short bio used to personalize drafts"
              rows={2}
              className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-text focus:outline-none focus:border-brand-gold resize-none"
            />
          </div>

          {/* Target cities */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-brand-gold uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> Target Cities (comma-separated)
            </label>
            <input
              value={cities}
              onChange={(e) => setCities(e.target.value)}
              className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-text focus:outline-none focus:border-brand-gold"
            />
          </div>

          {/* Keywords */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-brand-gold uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3 h-3" /> Watch Keywords (comma-separated)
            </label>
            <textarea
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              rows={3}
              className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-text focus:outline-none focus:border-brand-gold resize-none"
            />
          </div>

          {/* Subreddits */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-brand-gold uppercase tracking-wider">
              Subreddits (no r/, comma-separated)
            </label>
            <textarea
              value={subreddits}
              onChange={(e) => setSubreddits(e.target.value)}
              rows={3}
              className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-text focus:outline-none focus:border-brand-gold resize-none"
            />
          </div>

          {/* Time filter + save */}
          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-xs text-brand-muted">Time window</label>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-text focus:outline-none focus:border-brand-gold"
              >
                <option value="day">Past day</option>
                <option value="week">Past week</option>
                <option value="month">Past month</option>
              </select>
            </div>
            <div className="flex items-end flex-1">
              <button
                onClick={save}
                className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-dark font-semibold text-sm py-2 rounded-lg transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

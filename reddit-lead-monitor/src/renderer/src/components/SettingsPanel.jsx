import React, { useState } from 'react';
import {
  Settings, ChevronDown, ChevronUp, MapPin,
  Search, User, KeyRound, Eye, EyeOff, CheckCircle2,
} from 'lucide-react';
import useStore from '../store/useStore';
import { getStoredApiKey, saveApiKey } from '../services/claudeService';

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

  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [showKey, setShowKey] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  const hasKey = !!getStoredApiKey();

  const saveKey = () => {
    saveApiKey(apiKey);
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  };

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
          <span className="text-sm font-medium">Settings</span>
          {!hasKey && (
            <span className="text-xs bg-amber-900/50 text-amber-400 border border-amber-800 px-2 py-0.5 rounded-full">
              API key required
            </span>
          )}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-brand-muted" /> : <ChevronDown className="w-4 h-4 text-brand-muted" />}
      </button>

      {open && (
        <div className="p-4 border-t border-brand-border bg-brand-dark space-y-5">

          {/* API Key */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-brand-gold uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-3 h-3" /> Anthropic API Key
            </label>
            <p className="text-xs text-brand-muted">
              Required for AI draft generation. Get yours free at{' '}
              <span className="text-brand-gold">console.anthropic.com</span>
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2 pr-10 text-sm text-brand-text focus:outline-none focus:border-brand-gold font-mono"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                onClick={saveKey}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-brand-gold hover:bg-brand-gold/90 text-brand-dark transition-colors whitespace-nowrap"
              >
                {keySaved ? <CheckCircle2 className="w-4 h-4" /> : null}
                {keySaved ? 'Saved!' : 'Save Key'}
              </button>
            </div>
            {hasKey && (
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> API key saved
              </p>
            )}
          </div>

          <hr className="border-brand-border" />

          {/* Team Info */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-brand-gold uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3 h-3" /> Team Info
            </label>
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

          {/* Cities */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-brand-gold uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> Target Cities
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
              <Search className="w-3 h-3" /> Watch Keywords
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
              Subreddits (no r/)
            </label>
            <textarea
              value={subreddits}
              onChange={(e) => setSubreddits(e.target.value)}
              rows={3}
              className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-text focus:outline-none focus:border-brand-gold resize-none"
            />
          </div>

          {/* Time + Save */}
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

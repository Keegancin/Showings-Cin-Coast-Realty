import React, { useState, useCallback } from 'react';
import {
  ExternalLink, Wand2, Copy, CheckCheck, ArrowUp,
  MessageSquare, Clock, AlertCircle, ChevronDown,
  ChevronUp, CheckCircle2, RotateCcw,
} from 'lucide-react';
import useStore from '../store/useStore';

function timeAgo(utcSeconds) {
  const diff = Math.floor(Date.now() / 1000 - utcSeconds);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function LeadCard({ post }) {
  const {
    drafts, editedDrafts, generating, draftErrors, responded,
    generateDraftForPost, updateEditedDraft, toggleResponded,
  } = useStore();

  const [bodyExpanded, setBodyExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const draft = drafts[post.id] || '';
  const editedDraft = editedDrafts[post.id] ?? draft;
  const isGenerating = generating[post.id] || false;
  const error = draftErrors[post.id];
  const isResponded = responded.includes(post.id);
  const hasDraft = !!draft;
  const wordCount = editedDraft.trim().split(/\s+/).filter(Boolean).length;

  const copy = useCallback(() => {
    const text = editedDraft || draft;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [editedDraft, draft]);

  const bodyPreview = post.body.length > 280
    ? post.body.slice(0, 280) + '…'
    : post.body;

  return (
    <article className={`rounded-xl border overflow-hidden transition-opacity ${
      isResponded ? 'border-emerald-800 opacity-50' : 'border-brand-border'
    }`}>
      {/* Card header */}
      <div className="p-4 bg-brand-surface">
        {/* Badges row */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <a
            href={`https://reddit.com/r/${post.subreddit}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-brand-gold bg-brand-gold/10 border border-brand-gold/20 px-2 py-0.5 rounded-full hover:bg-brand-gold/20 transition-colors"
          >
            r/{post.subreddit}
          </a>
          {post.flair && (
            <span className="text-xs text-brand-muted border border-brand-border px-2 py-0.5 rounded-full">
              {post.flair}
            </span>
          )}
          {isResponded && (
            <span className="text-xs text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Responded
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-brand-text leading-snug mb-2">
          {post.title}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-brand-muted">
          <span className="flex items-center gap-1">
            <ArrowUp className="w-3.5 h-3.5" /> {post.score}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" /> {post.numComments}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {timeAgo(post.created)}
          </span>
          <span>u/{post.author}</span>
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1 text-brand-gold hover:underline"
          >
            View <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Body */}
        {post.body && (
          <div className="mt-3 pt-3 border-t border-brand-border">
            <p className="text-xs text-brand-muted leading-relaxed whitespace-pre-line">
              {bodyExpanded ? post.body : bodyPreview}
            </p>
            {post.body.length > 280 && (
              <button
                onClick={() => setBodyExpanded(!bodyExpanded)}
                className="mt-1 text-xs text-brand-gold flex items-center gap-1 hover:underline"
              >
                {bodyExpanded
                  ? <><ChevronUp className="w-3 h-3" /> Show less</>
                  : <><ChevronDown className="w-3 h-3" /> Show more</>}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="px-4 py-3 bg-brand-card border-t border-brand-border flex items-center gap-2 flex-wrap">
        <button
          onClick={() => generateDraftForPost(post.id)}
          disabled={isGenerating}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            isGenerating
              ? 'bg-brand-surface text-brand-muted cursor-not-allowed'
              : 'bg-brand-gold hover:bg-brand-gold/90 text-brand-dark'
          }`}
        >
          {hasDraft
            ? <RotateCcw className="w-3.5 h-3.5" />
            : <Wand2 className="w-3.5 h-3.5" />}
          {isGenerating ? 'Generating…' : hasDraft ? 'Regenerate Draft' : 'Generate Draft'}
        </button>

        {hasDraft && (
          <button
            onClick={copy}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-brand-surface border border-brand-border text-brand-text hover:border-brand-gold transition-colors"
          >
            {copied
              ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
              : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Draft'}
          </button>
        )}

        <button
          onClick={() => toggleResponded(post.id)}
          className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            isResponded
              ? 'bg-emerald-950 border-emerald-800 text-emerald-400 hover:bg-emerald-900'
              : 'bg-brand-surface border-brand-border text-brand-muted hover:border-brand-gold hover:text-brand-text'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          {isResponded ? 'Mark Undone' : 'Mark Responded'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 bg-red-950 border-t border-red-800 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-red-400">Draft generation failed</p>
            <p className="text-xs text-red-400/70 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Draft editor */}
      {hasDraft && (
        <div className="p-4 bg-brand-dark border-t border-brand-border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-brand-gold uppercase tracking-wider">
                AI Draft
              </span>
              <span className="text-xs text-brand-muted">— review, edit, then copy & post to Reddit</span>
            </div>
            {isGenerating && (
              <span className="text-xs text-brand-muted animate-pulse">streaming…</span>
            )}
          </div>

          <textarea
            value={editedDraft}
            onChange={(e) => updateEditedDraft(post.id, e.target.value)}
            rows={9}
            className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2.5 text-sm text-brand-text leading-relaxed focus:outline-none focus:border-brand-gold resize-y transition-colors"
            placeholder="Draft will appear here…"
          />

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-brand-muted">
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
              {wordCount > 0 && (wordCount < 100
                ? ' — consider expanding'
                : wordCount > 300
                ? ' — consider trimming'
                : ' — good length')}
            </span>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 text-xs text-brand-gold hover:underline"
            >
              {copied ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy to clipboard'}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchRedditLeads, DEFAULT_SUBREDDITS, DEFAULT_KEYWORDS } from '../services/redditService';
import { generateDraft } from '../services/claudeService';

const useStore = create(
  persist(
    (set, get) => ({
      // ── Leads ──────────────────────────────────────────────────────────
      leads: [],
      loading: false,
      error: null,
      lastFetched: null,

      // ── Drafts ─────────────────────────────────────────────────────────
      // drafts[id]        — streamed AI text (source of truth for display)
      // editedDrafts[id]  — user's edits; initialized from draft on first gen
      // generating[id]    — boolean streaming flag
      // draftErrors[id]   — error message string
      drafts: {},
      editedDrafts: {},
      generating: {},
      draftErrors: {},

      // ── Status ─────────────────────────────────────────────────────────
      responded: [],   // post IDs marked as responded

      // ── Settings ───────────────────────────────────────────────────────
      settings: {
        cities: ['Cincinnati', 'Dayton', 'Columbus', 'Northern Kentucky', 'Louisville'],
        keywords: DEFAULT_KEYWORDS,
        subreddits: DEFAULT_SUBREDDITS,
        timeFilter: 'month',
        teamName: 'Keegan',
        teamTitle: 'Team Lead & Luxury Specialist',
        teamBio: 'With over 15 years of experience in luxury real estate, specializing in helping families find their perfect home in the Cincinnati region.',
      },

      // ── Actions ────────────────────────────────────────────────────────

      fetchLeads: async () => {
        set({ loading: true, error: null });
        try {
          const { settings } = get();
          const leads = await fetchRedditLeads({
            cities: settings.cities,
            keywords: settings.keywords,
            subreddits: settings.subreddits,
            timeFilter: settings.timeFilter,
          });
          set({ leads, loading: false, lastFetched: Date.now() });
        } catch (err) {
          set({ loading: false, error: err.message });
        }
      },

      generateDraftForPost: async (postId) => {
        const { leads, settings } = get();
        const post = leads.find((p) => p.id === postId);
        if (!post) return;

        set((s) => ({
          generating: { ...s.generating, [postId]: true },
          draftErrors: { ...s.draftErrors, [postId]: null },
          drafts: { ...s.drafts, [postId]: '' },
          editedDrafts: { ...s.editedDrafts, [postId]: '' },
        }));

        try {
          let accumulated = '';
          await generateDraft(
            post,
            {
              name: settings.teamName,
              title: settings.teamTitle,
              bio: settings.teamBio,
            },
            settings.cities,
            (chunk) => {
              accumulated += chunk;
              set((s) => ({
                drafts: { ...s.drafts, [postId]: accumulated },
                editedDrafts: { ...s.editedDrafts, [postId]: accumulated },
              }));
            }
          );
          set((s) => ({
            generating: { ...s.generating, [postId]: false },
          }));
        } catch (err) {
          set((s) => ({
            generating: { ...s.generating, [postId]: false },
            draftErrors: { ...s.draftErrors, [postId]: err.message },
          }));
        }
      },

      updateEditedDraft: (postId, text) =>
        set((s) => ({ editedDrafts: { ...s.editedDrafts, [postId]: text } })),

      toggleResponded: (postId) =>
        set((s) => ({
          responded: s.responded.includes(postId)
            ? s.responded.filter((id) => id !== postId)
            : [...s.responded, postId],
        })),

      updateSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),
    }),
    {
      name: 'cin-coast-reddit-leads',
      partialize: (s) => ({
        responded: s.responded,
        settings: s.settings,
        editedDrafts: s.editedDrafts,
      }),
    }
  )
);

export default useStore;

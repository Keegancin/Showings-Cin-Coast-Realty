import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchRedditLeads, DEFAULT_SUBREDDITS, DEFAULT_KEYWORDS } from '../services/redditService';
import { generateDraft } from '../services/claudeService';

const useRedditStore = create(
  persist(
    (set, get) => ({
      // ── Leads ──────────────────────────────────────────────────────────────
      leads: [],
      isLoadingLeads: false,
      leadsError: null,
      lastFetched: null,
      responded: [],        // post IDs marked as responded

      // ── Drafts ────────────────────────────────────────────────────────────
      drafts: {},           // { [postId]: string }
      editedDrafts: {},     // { [postId]: string } — user edits
      generatingDraft: {},  // { [postId]: boolean }
      draftErrors: {},      // { [postId]: string }

      // ── Settings ──────────────────────────────────────────────────────────
      settings: {
        cities: ['Cincinnati', 'Dayton', 'Columbus', 'Northern Kentucky', 'Louisville'],
        keywords: DEFAULT_KEYWORDS,
        subreddits: DEFAULT_SUBREDDITS,
        timeFilter: 'month',
      },

      // ── Actions ───────────────────────────────────────────────────────────

      fetchLeads: async () => {
        set({ isLoadingLeads: true, leadsError: null });
        try {
          const { settings } = get();
          const leads = await fetchRedditLeads({
            cities: settings.cities,
            keywords: settings.keywords,
            subreddits: settings.subreddits,
            timeFilter: settings.timeFilter,
          });
          set({ leads, isLoadingLeads: false, lastFetched: Date.now() });
        } catch (err) {
          set({ isLoadingLeads: false, leadsError: err.message });
        }
      },

      generateDraftForPost: async (post, teamInfo) => {
        const { settings, drafts } = get();

        set((s) => ({
          generatingDraft: { ...s.generatingDraft, [post.id]: true },
          draftErrors: { ...s.draftErrors, [post.id]: null },
          drafts: { ...s.drafts, [post.id]: '' },
        }));

        try {
          let accumulated = '';

          await generateDraft(
            post,
            teamInfo,
            settings.cities,
            (chunk) => {
              accumulated += chunk;
              set((s) => ({
                drafts: { ...s.drafts, [post.id]: accumulated },
              }));
            }
          );

          // Sync edited draft to generated draft when first generated
          set((s) => ({
            generatingDraft: { ...s.generatingDraft, [post.id]: false },
            editedDrafts: { ...s.editedDrafts, [post.id]: accumulated },
          }));
        } catch (err) {
          set((s) => ({
            generatingDraft: { ...s.generatingDraft, [post.id]: false },
            draftErrors: { ...s.draftErrors, [post.id]: err.message },
          }));
        }
      },

      updateEditedDraft: (postId, text) => {
        set((s) => ({
          editedDrafts: { ...s.editedDrafts, [postId]: text },
        }));
      },

      markResponded: (postId) => {
        set((s) => ({
          responded: s.responded.includes(postId)
            ? s.responded.filter((id) => id !== postId)
            : [...s.responded, postId],
        }));
      },

      updateSettings: (updates) => {
        set((s) => ({
          settings: { ...s.settings, ...updates },
        }));
      },

      clearDraft: (postId) => {
        set((s) => {
          const drafts = { ...s.drafts };
          const editedDrafts = { ...s.editedDrafts };
          delete drafts[postId];
          delete editedDrafts[postId];
          return { drafts, editedDrafts };
        });
      },
    }),
    {
      name: 'reddit-leads-storage',
      partialize: (s) => ({
        responded: s.responded,
        settings: s.settings,
        editedDrafts: s.editedDrafts,
      }),
    }
  )
);

export default useRedditStore;

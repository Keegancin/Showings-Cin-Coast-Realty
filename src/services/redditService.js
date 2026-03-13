// Reddit public JSON API — no auth required for read-only public posts.
// Note: Reddit may rate-limit heavy usage. In production, route through
// a lightweight backend proxy if needed.

export const DEFAULT_SUBREDDITS = [
  'RealEstate',
  'FirstTimeHomeBuyer',
  'personalfinance',
  'cincinnati',
  'Cleveland',
  'Columbus',
  'Dayton',
  'Louisville',
  'lexington',
  'Indianapolis',
  'homebuying',
  'realestateinvesting',
];

export const DEFAULT_KEYWORDS = [
  'real estate agent',
  'realtor recommendation',
  'need realtor',
  'buying a home',
  'first time buyer',
  'looking for agent',
  'recommend agent',
  'find a realtor',
  'buyer agent',
  'listing agent',
];

async function redditFetch(url) {
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Reddit ${res.status}: ${res.statusText}`);
  return res.json();
}

function normalizePost(post) {
  const p = post.data;
  return {
    id: p.id,
    title: p.title,
    body: p.selftext || '',
    subreddit: p.subreddit,
    author: p.author,
    score: p.score,
    url: `https://www.reddit.com${p.permalink}`,
    created: p.created_utc,
    numComments: p.num_comments,
    flair: p.link_flair_text || null,
  };
}

/**
 * Fetch Reddit leads matching real estate agent keywords.
 *
 * @param {object} opts
 * @param {string[]} opts.cities        – Extra city names to include in query
 * @param {string[]} opts.keywords      – Keywords to search for
 * @param {string[]} opts.subreddits    – Subreddits to search within
 * @param {string}   opts.timeFilter    – 'day' | 'week' | 'month' (default: 'month')
 * @returns {Promise<object[]>}
 */
export async function fetchRedditLeads({
  cities = [],
  keywords = DEFAULT_KEYWORDS,
  subreddits = DEFAULT_SUBREDDITS,
  timeFilter = 'month',
} = {}) {
  const seen = new Set();
  const leads = [];

  const addPosts = (children) => {
    for (const post of children || []) {
      const p = normalizePost(post);
      if (!seen.has(p.id)) {
        seen.add(p.id);
        leads.push(p);
      }
    }
  };

  // Build keyword query — OR together first 4 keywords to keep URL short
  const kwQuery = keywords.slice(0, 4).join(' OR ');

  // 1. Per-subreddit searches (run in parallel, cap at 8)
  const subResults = await Promise.allSettled(
    subreddits.slice(0, 8).map((sub) =>
      redditFetch(
        `https://www.reddit.com/r/${sub}/search.json?` +
          `q=${encodeURIComponent(kwQuery)}&restrict_sr=1&sort=new&limit=10&t=${timeFilter}&raw_json=1`
      )
    )
  );

  for (const result of subResults) {
    if (result.status === 'fulfilled') {
      addPosts(result.value?.data?.children);
    }
  }

  // 2. Global search with city context
  const cityPart =
    cities.length > 0 ? ` (${cities.slice(0, 4).join(' OR ')})` : '';
  try {
    const globalData = await redditFetch(
      `https://www.reddit.com/search.json?` +
        `q=${encodeURIComponent(kwQuery + cityPart)}&sort=new&limit=20&t=${timeFilter}&raw_json=1`
    );
    addPosts(globalData?.data?.children);
  } catch (err) {
    console.warn('Reddit global search failed:', err.message);
  }

  // Sort newest first
  return leads.sort((a, b) => b.created - a.created);
}

export const DEFAULT_SUBREDDITS = [
  'RealEstate',
  'FirstTimeHomeBuyer',
  'homebuying',
  'personalfinance',
  'LosAngeles',
  'orangecounty',
  'AskLosAngeles',
  'irvine',
  'longbeach',
  'SantaMonica',
  'CaliforniaHomes',
  'realestateinvesting',
];

export const DEFAULT_KEYWORDS = [
  'real estate agent',
  'realtor recommendation',
  'need a realtor',
  'buying a home',
  'first time buyer',
  'looking for agent',
  'recommend agent',
  'find a realtor',
  'buyer agent',
  'listing agent',
];

async function redditGet(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Reddit API ${res.status}: ${res.statusText}`);
  return res.json();
}

function toPost(raw) {
  const p = raw.data;
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

export async function fetchRedditLeads({
  cities = [],
  keywords = DEFAULT_KEYWORDS,
  subreddits = DEFAULT_SUBREDDITS,
  timeFilter = 'month',
} = {}) {
  const seen = new Set();
  const posts = [];

  const add = (children = []) => {
    for (const item of children) {
      const post = toPost(item);
      if (!seen.has(post.id)) {
        seen.add(post.id);
        posts.push(post);
      }
    }
  };

  const kwQuery = keywords.slice(0, 4).join(' OR ');

  const results = await Promise.allSettled(
    subreddits.slice(0, 8).map((sub) =>
      redditGet(
        `https://www.reddit.com/r/${sub}/search.json` +
          `?q=${encodeURIComponent(kwQuery)}&restrict_sr=1&sort=new&limit=10&t=${timeFilter}&raw_json=1`
      )
    )
  );

  for (const r of results) {
    if (r.status === 'fulfilled') add(r.value?.data?.children);
  }

  const cityPart = cities.length > 0 ? ` (${cities.slice(0, 4).join(' OR ')})` : '';
  try {
    const global = await redditGet(
      `https://www.reddit.com/search.json` +
        `?q=${encodeURIComponent(kwQuery + cityPart)}&sort=new&limit=20&t=${timeFilter}&raw_json=1`
    );
    add(global?.data?.children);
  } catch (e) {
    console.warn('Global search failed:', e.message);
  }

  return posts.sort((a, b) => b.created - a.created);
}

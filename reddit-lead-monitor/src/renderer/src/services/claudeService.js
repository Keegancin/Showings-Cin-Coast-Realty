// API key is stored in localStorage — user enters it once in Settings.
// No .env file needed.

import Anthropic from '@anthropic-ai/sdk';

export const API_KEY_STORAGE_KEY = 'cin_coast_anthropic_key';

export function getStoredApiKey() {
  return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
}

export function saveApiKey(key) {
  localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
}

function getClient() {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw new Error(
      'No API key saved.\nOpen Settings and paste your Anthropic API key.'
    );
  }
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
}

const SYSTEM_PROMPT = `You are an expert Reddit response writer for Cin Coast Realty — a real estate team led by Keegan (Team Lead & Luxury Specialist, 15+ years experience in Los Angeles and Orange County).

Write authentic, helpful Reddit replies to posts where someone needs real estate help. Rules:
1. Lead with genuine, specific advice — value first, promotion second
2. Sound like a real, experienced person on Reddit (not a corporate ad)
3. Weave in geo-relevant keywords naturally (city/neighborhood names in LA/OC)
4. Include buyer-facing SEO terms where they fit (pre-approval, closing costs, buyer's agent, escrow, earnest money, inspection contingency, HOA, etc.)
5. Softly mention Keegan / Cin Coast Realty as an option — never the main focus
6. Close with a low-pressure CTA (DM, happy to answer questions, etc.)

Length: 150–250 words. Tone: warm, knowledgeable, conversational.
Never open with "Great question!" No corporate buzzwords.`;

export async function generateDraft(post, teamInfo, cities = [], onChunk) {
  const client = getClient();

  const serviceArea =
    cities.length > 0
      ? cities.join(', ')
      : 'Los Angeles, Orange County, Irvine, Long Beach, Newport Beach, Huntington Beach, Pasadena';

  const prompt = `Write a Reddit reply for this post.

Service area: ${serviceArea}
Team: ${teamInfo.name} — ${teamInfo.title}, Cin Coast Realty
${teamInfo.bio ? `Background: ${teamInfo.bio}` : ''}

Post:
Subreddit: r/${post.subreddit}
Title: ${post.title}
${post.body ? `Body:\n${post.body.slice(0, 1000)}` : '(title-only post)'}

Requirements:
• Open by directly addressing their situation
• Give 1–2 concrete, useful pieces of advice
• Reference LA/OC city or neighborhood context where relevant
• Mention Keegan / Cin Coast Realty naturally — not the lead
• Use real estate terms buyers search for
• End with a soft one-sentence CTA
• Plain text only — no markdown headers or bullets in the reply itself`;

  const stream = client.messages.stream({
    model: 'claude-opus-4-6',
    max_tokens: 600,
    thinking: { type: 'adaptive' },
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  });

  let full = '';
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      full += event.delta.text;
      onChunk?.(event.delta.text);
    }
  }
  return full;
}

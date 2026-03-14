// Claude API — generates SEO & geo-optimized Reddit reply drafts.
//
// SETUP: Add VITE_ANTHROPIC_API_KEY=sk-ant-... to a .env file in this
// directory (see .env.example). The key is bundled into the build, so
// keep this app internal / team-only.

import Anthropic from '@anthropic-ai/sdk';

function getClient() {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      'VITE_ANTHROPIC_API_KEY is not set.\n' +
        'Copy .env.example → .env and add your Anthropic API key.'
    );
  }
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
}

const SYSTEM_PROMPT = `You are an expert Reddit response writer for Cin Coast Realty — a real estate team led by Keegan (Team Lead & Luxury Specialist, 15+ years experience).

Your job: write authentic, helpful Reddit replies to posts where someone needs real estate help. The response should:
1. Lead with genuine, specific advice — value first, promotion second
2. Sound like a real, experienced person on Reddit (not a corporate ad)
3. Naturally weave in geo-relevant keywords (city/neighborhood names)
4. Include buyer-facing SEO terms where they fit naturally (pre-approval, closing costs, buyer's agent, buyer's agent commission, escrow, earnest money, inspection contingency, etc.)
5. Softly mention Keegan / Cin Coast Realty as an option — never the main focus
6. Close with a low-pressure CTA (DM, happy to answer questions, etc.)

Length: 150–250 words. Tone: warm, knowledgeable, conversational.
Never open with "Great question!" or similar filler. No corporate buzzwords.`;

/**
 * Generate a draft Reddit reply for a given post.
 * Streams the response and calls onChunk(text) with each delta.
 *
 * @param {object}   post       The Reddit post
 * @param {object}   teamInfo   { name, title, bio }
 * @param {string[]} cities     Target service area cities
 * @param {Function} onChunk    Called with each streamed text chunk
 * @returns {Promise<string>}   Full draft text on completion
 */
export async function generateDraft(post, teamInfo, cities = [], onChunk) {
  const client = getClient();

  const serviceArea =
    cities.length > 0
      ? cities.join(', ')
      : 'Los Angeles, Orange County, Irvine, Long Beach, Newport Beach, Huntington Beach, Pasadena';

  const prompt = `Write a Reddit reply draft for this post.

Service area: ${serviceArea}
Team: ${teamInfo.name} — ${teamInfo.title}, Cin Coast Realty
${teamInfo.bio ? `Background: ${teamInfo.bio}` : ''}

Post:
Subreddit: r/${post.subreddit}
Title: ${post.title}
${post.body ? `Body:\n${post.body.slice(0, 1000)}` : '(title-only post)'}

Draft requirements:
• Open by directly addressing their situation or question
• Give 1–2 concrete, genuinely useful pieces of advice
• Reference specific city/regional context where relevant
• Mention Keegan / Cin Coast Realty naturally — not the lead
• Use relevant real estate terms buyers search for
• End with a soft, one-sentence CTA
• Plain text only — no markdown headers or bullet points in the reply itself`;

  const stream = client.messages.stream({
    model: 'claude-opus-4-6',
    max_tokens: 600,
    thinking: { type: 'adaptive' },
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  });

  let full = '';
  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      full += event.delta.text;
      onChunk?.(event.delta.text);
    }
  }
  return full;
}

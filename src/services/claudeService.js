// Claude API service for generating SEO & geo-optimized Reddit response drafts.
//
// SETUP: Add your Anthropic API key to a .env file at the project root:
//   VITE_ANTHROPIC_API_KEY=sk-ant-...
//
// Security note: This key will be bundled into the client. Use this for
// internal team tools only — do not expose to public users.

import Anthropic from '@anthropic-ai/sdk';

function getClient() {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Missing VITE_ANTHROPIC_API_KEY in .env — see src/services/claudeService.js for setup instructions.'
    );
  }
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
}

const SYSTEM_PROMPT = `You are an expert Reddit response writer for Cin Coast Realty — a real estate team led by Keegan (Team Lead & Luxury Specialist, 15+ years experience in Cincinnati and surrounding areas).

Your job is to write authentic, helpful Reddit replies to posts where people are looking for real estate help. The goals are:
1. Be genuinely useful first — provide real value before any promotion
2. Sound like a real person on Reddit, not a corporate advertisement
3. Naturally weave in SEO/geo-friendly terms (city names, neighborhood names, buyer terms)
4. Softly introduce Keegan's team as a resource, never pushy
5. Keep it 150–250 words — detailed enough to help, short enough to read

Tone: Conversational, warm, knowledgeable. No exclamation mark abuse. No "Great question!" openers.`;

/**
 * Generate a draft Reddit response for a given post.
 * Streams the response and calls onChunk(text) with each delta.
 *
 * @param {object} post         – The Reddit post object
 * @param {object} teamInfo     – Agent/team info to personalize the draft
 * @param {string[]} cities     – Target cities for geo keywords
 * @param {Function} onChunk    – Called with each streamed text chunk
 * @returns {Promise<string>}   – Full draft text when complete
 */
export async function generateDraft(post, teamInfo, cities = [], onChunk) {
  const client = getClient();

  const cityContext =
    cities.length > 0
      ? `Target cities/areas: ${cities.join(', ')}.`
      : 'The team serves Cincinnati and surrounding areas (Dayton, Columbus, Northern Kentucky, Louisville corridor).';

  const userPrompt = `Write a Reddit reply draft for the following post. ${cityContext}

Team info:
- Team Lead: ${teamInfo.name} (${teamInfo.title})
- Team: Cin Coast Realty
- Specialty: ${teamInfo.bio || 'Residential and luxury real estate, helping buyers and sellers across the region'}

Reddit post:
Subreddit: r/${post.subreddit}
Title: ${post.title}
${post.body ? `Body:\n${post.body.slice(0, 800)}` : '(No body text — title only)'}

Write a draft reply that:
• Opens by directly addressing their situation (no "Great question!" openers)
• Gives 1–2 genuinely useful pieces of advice specific to their question
• Naturally mentions Keegan / Cin Coast Realty as an option — not the main focus
• Uses geo-relevant terms naturally (city, neighborhood, or regional context)
• Includes buyer-facing SEO terms where natural (e.g., "closing costs", "pre-approval", "buyer's agent commission", "listing agent", etc.)
• Ends with a soft, low-pressure CTA (DM, reach out, happy to help)
• Sounds human — like an experienced agent who actually uses Reddit

Format: Plain text only, ready to copy-paste into Reddit. No markdown headers.`;

  const stream = client.messages.stream({
    model: 'claude-opus-4-6',
    max_tokens: 600,
    thinking: { type: 'adaptive' },
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  });

  let fullText = '';

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      fullText += event.delta.text;
      onChunk?.(event.delta.text);
    }
  }

  return fullText;
}

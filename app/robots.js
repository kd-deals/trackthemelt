import { SITE_URL } from '../lib/site';

export const dynamic = 'force-static';

// Search engines and AI assistants (search, answer and training crawlers) are all welcome.
const AI_BOTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
  'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Bingbot', 'DuckAssistBot',
];

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/' }, { userAgent: AI_BOTS, allow: '/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

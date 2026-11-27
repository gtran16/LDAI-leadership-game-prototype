/* The Leadership Game: AI proxy on Cloudflare Workers (free plan).
   The game sends { prompt, modelTier } and gets back { text, truncated }, the same shape as claude.ai's sample().
   The API key lives only as a Worker secret: wrangler secret put ANTHROPIC_API_KEY */
import Anthropic from '@anthropic-ai/sdk';

/* Lightest model each tier needs (see docs/model-right-sizing.md). Open-weight stand-ins for later RunPod hosting are noted there.
   Thinking is off on both tiers: every call is a single JSON reply, and thinking tokens bill as output. */
const TIERS = {
  default: { model: 'claude-sonnet-5-5', max_tokens: 4096, thinking: { type: 'between_tools' } },
  quick: { model: 'claude-haiku-5-5', max_tokens: 1024, thinking: { type: 'disabled' }, output_config: { effort: 'medium' } }
};
const MAX_PROMPT_CHARS = 60000; /* longest prompt (P7) is about 32K characters */

function reply(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': origin,
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
      vary: 'Origin'
    }
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!allowed.includes(origin)) return new Response('Forbidden', { status: 403 });
    if (request.method === 'OPTIONS') return reply({}, 204, origin);
    if (request.method !== 'POST') return reply({ error: 'POST only' }, 405, origin);

    let body;
    try { body = await request.json(); } catch (e) { return reply({ error: 'Bad JSON' }, 400, origin); }
    const tier = TIERS[body.modelTier] || TIERS.default;
    const prompt = typeof body.prompt === 'string' ? body.prompt : '';
    if (!prompt || prompt.length > MAX_PROMPT_CHARS) return reply({ error: 'Bad prompt' }, 400, origin);

    /* Daily cap, counted in KV per UTC day. Not atomic, so it can overshoot by a call or two; the Console spend limit is the hard stop. */
    const day = 'calls:' + new Date().toISOString().slice(0, 10);
    const used = parseInt((await env.USAGE.get(day)) || '0', 10);
    const cap = parseInt(env.DAILY_CALL_CAP || '125', 10);
    if (used >= cap) return reply({ error: 'daily_cap', message: 'The shared AI budget for today is used up.' }, 429, origin);
    await env.USAGE.put(day, String(used + 1), { expirationTtl: 60 * 60 * 48 });

    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    try {
      const params = { model: tier.model, max_tokens: tier.max_tokens, thinking: tier.thinking, messages: [{ role: 'user', content: prompt }] };
      if (tier.output_config) params.output_config = tier.output_config;
      const msg = await client.messages.create(params);
      if (msg.stop_reason === 'refusal') return reply({ error: 'refusal', message: 'The AI declined this request.' }, 502, origin);
      const text = msg.content.filter(b => b.type === 'text').map(b => b.text).join('');
      return reply({ text, truncated: msg.stop_reason === 'max_tokens' }, 200, origin);
    } catch (e) {
      if (e instanceof Anthropic.RateLimitError) return reply({ error: 'rate_limited' }, 429, origin);
      if (e instanceof Anthropic.APIError) return reply({ error: 'api_error', status: e.status }, 502, origin);
      return reply({ error: 'worker_error' }, 500, origin);
    }
  }
};

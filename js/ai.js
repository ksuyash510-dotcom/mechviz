// ai.js — MechViz AI Tutor
// Calls Cloudflare Worker proxy (key hidden server-side)

// ⚠️  REPLACE THIS with your actual Cloudflare Worker URL
const WORKER_URL = 'https://mechviz-proxy.ksuyash510.workers.dev';

async function callGroq(userMessage, concept) {
  const systemPrompt = `You are MechViz AI, an expert Mechanical Engineering tutor.
The student is currently studying: "${concept.title}" (${concept.shortDesc})

Key context:
DEFINITION: ${concept.theory.definition.slice(0, 400)}

FORMULAS: ${concept.theory.formulas.map(f => `${f.name}: ${f.eq}`).join(' | ')}

EXPLANATION: ${concept.theory.explanation.slice(0, 400)}

INSTRUCTIONS:
- Answer clearly and concisely. Start simple, then add depth if needed.
- Use real-world analogies and examples.
- For derivations, show step-by-step working.
- Keep responses under 280 words unless a full derivation is requested.
- Always include units with numbers.
- If the question is unrelated to engineering, politely redirect.`;

  let resp;
  try {
    resp = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: userMessage }
        ],
        max_tokens: 500,
        temperature: 0.65
      })
    });
  } catch {
    throw new Error('Could not reach the AI service. Check your internet connection.');
  }

  if (!resp.ok) {
    let msg = 'AI service error. Please try again.';
    try {
      const err = await resp.json();
      msg = err.error?.message || msg;
      if (resp.status === 429) msg = 'Too many requests — please wait a moment and try again.';
    } catch (_) {}
    throw new Error(msg);
  }

  const data = await resp.json();
  return data.choices?.[0]?.message?.content || 'Sorry, no response was generated.';
}

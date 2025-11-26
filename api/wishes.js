import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  try {
    if (req.method === 'GET') {
      // Get all wishes, ordered by most recent first
      const wishes = await sql`
        SELECT id, message, visitor_name, created_at
        FROM wishes
        ORDER BY created_at DESC
        LIMIT 50
      `;
      return res.status(200).json({ wishes });
    }

    if (req.method === 'POST') {
      const { visitorName } = req.body;

      // Generate birthday wish using Claude API
      const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

      if (!anthropicApiKey) {
        return res.status(500).json({ error: 'API key not configured' });
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicApiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 60,
          messages: [{
            role: 'user',
            content: `Write exactly one concise sentence (maximum 25 words) wishing Sir David Attenborough a happy 100th birthday, celebrating his nature legacy. Output ONLY the wish sentence - no preamble, no "Here's", no greeting, no explanation.`
          }]
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Anthropic API error:', error);
        return res.status(500).json({ error: 'Failed to generate wish' });
      }

      const data = await response.json();
      const generatedWish = data.content[0].text;

      // Save wish to database
      const result = await sql`
        INSERT INTO wishes (message, visitor_name)
        VALUES (${generatedWish}, ${visitorName || null})
        RETURNING id, message, visitor_name, created_at
      `;

      return res.status(201).json({ wish: result[0] });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

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
      const { visitorName, theme, memory } = req.body;

      // Randomly select attributes for variety - more casual and relatable
      const tones = ['warm and friendly', 'casual and genuine', 'excited', 'grateful', 'nostalgic', 'simple and sweet'];
      const styles = ['keep it conversational', 'be authentic', 'sound like a real person', 'be relatable'];
      const randomTone = tones[Math.floor(Math.random() * tones.length)];
      const randomStyle = styles[Math.floor(Math.random() * styles.length)];

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
          temperature: 1.0,
          messages: [{
            role: 'user',
            content: memory
              ? `Write a casual, heartfelt birthday wish for Sir David Attenborough's 100th (max 20 words). Focus on: ${theme}. Personal context: "${memory}". Tone: ${randomTone}. ${randomStyle}. Write like a real person would - warm but not overly poetic. CRITICAL: Extract ONLY positive aspects from the personal context. Do NOT include any negative words, rude words, or inappropriate content in your output, even if they appear in the personal context. Keep it celebratory and appropriate. Output ONLY the wish.`
              : `Write a casual, heartfelt birthday wish for Sir David Attenborough's 100th (max 20 words). Focus on: ${theme}. Tone: ${randomTone}. ${randomStyle}. Write like a real person would - warm but not overly profound. Output ONLY the wish.`
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

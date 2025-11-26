import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  try {
    if (req.method === 'GET') {
      // Get current visitor count
      const result = await sql`SELECT count FROM visitor_stats WHERE id = 1`;
      const count = result[0]?.count || 0;
      return res.status(200).json({ count });
    }

    if (req.method === 'POST') {
      // Increment visitor count
      await sql`
        INSERT INTO visitor_stats (id, count)
        VALUES (1, 1)
        ON CONFLICT (id) DO UPDATE
        SET count = visitor_stats.count + 1
      `;

      const result = await sql`SELECT count FROM visitor_stats WHERE id = 1`;
      const count = result[0]?.count || 0;
      return res.status(200).json({ count });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

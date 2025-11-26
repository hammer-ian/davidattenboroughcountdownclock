// scripts/setup-db.js
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function setup() {
    await sql`
    CREATE TABLE IF NOT EXISTS visitor_stats (
      id INTEGER PRIMARY KEY DEFAULT 1,
      count INTEGER DEFAULT 0
    )
  `;

    await sql`
    INSERT INTO visitor_stats (id, count) 
    VALUES (1, 0) 
    ON CONFLICT (id) DO NOTHING
  `;

    await sql`
    CREATE TABLE IF NOT EXISTS wishes (
      id SERIAL PRIMARY KEY,
      message TEXT NOT NULL,
      visitor_name VARCHAR(100),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

    console.log('Database setup complete!');
}

setup();
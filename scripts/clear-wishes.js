// scripts/clear-wishes.js
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function clearWishes() {
  try {
    const result = await sql`DELETE FROM wishes`;
    console.log(`✅ Successfully deleted all wishes from database`);
    console.log(`   Rows deleted: ${result.length || 'N/A'}`);
  } catch (error) {
    console.error('❌ Error clearing wishes:', error);
  }
}

clearWishes();

import 'dotenv/config';

import { sql } from 'drizzle-orm';

import { createDatabaseClient } from '../src/client';
import { appMetadata } from '../src/schema';

async function seed() {
  const { db, pool } = createDatabaseClient();

  try {
    await db.execute(sql`select 1`);
    await db
      .insert(appMetadata)
      .values({
        key: 'starter-shell',
        value: new Date().toISOString(),
      })
      .onConflictDoUpdate({
        target: appMetadata.key,
        set: {
          value: new Date().toISOString(),
          updatedAt: new Date(),
        },
      });

    console.log('Seed completed');
  } finally {
    await pool.end();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});

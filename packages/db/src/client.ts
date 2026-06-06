import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { z } from 'zod';

import * as schema from './schema';

const databaseEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
});

export function readDatabaseUrl(env: NodeJS.ProcessEnv = process.env) {
  return databaseEnvSchema.parse(env).DATABASE_URL;
}

export function createDatabaseClient(connectionString = readDatabaseUrl()) {
  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema });

  return { db, pool };
}

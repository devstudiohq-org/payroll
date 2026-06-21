import { createDatabaseClient } from '@starter/db';

export type Database = ReturnType<typeof createDatabaseClient>['db'];

let cached: ReturnType<typeof createDatabaseClient> | null = null;

/** Lazily create and reuse a single pooled database client for the process. */
export function getDb(connectionString?: string): Database {
  if (!cached) {
    cached = createDatabaseClient(connectionString);
  }

  return cached.db;
}

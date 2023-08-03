import { Pool } from 'pg';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_URL } from '$env/static/private';

declare let global: typeof globalThis & {
  db: ReturnType<typeof drizzle> | undefined;
};

const db: NodePgDatabase =
  global.db ||
  drizzle(
    new Pool({
      connectionString: DATABASE_URL + '?sslmode=require',
    }),
  );

// Save the instance outside of the scope of this script for reuse
if (process.env.NODE_ENV === 'development') {
  global.db = db;
}

export { db };

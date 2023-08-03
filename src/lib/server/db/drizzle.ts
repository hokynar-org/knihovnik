import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { DATABASE_URL } from '$env/static/private';

declare let global: typeof globalThis & {
  db: ReturnType<typeof drizzle> | undefined;
};

const db = global.db || drizzle(postgres(DATABASE_URL + '?sslmode=require'));

if (process.env.NODE_ENV === 'development') {
  global.db = db;
}

export { db };

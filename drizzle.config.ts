import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/server/db/schema.ts',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL + '?sslmode=require',
    ssl: true,
  },
} satisfies Config;

import Pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

import 'dotenv/config';

const pool = new Pg.Pool({
  connectionString: process.env.DATABASE_URL + '?sslmode=require',
});
const db = drizzle(pool);

await migrate(db, { migrationsFolder: `${process.cwd()}/drizzle` });

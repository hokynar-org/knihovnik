import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { db_url } from '$env/static/private';

const db = global.db || drizzle(postgres(db_url+"?sslmode=require"))

if (process.env.NODE_ENV === "development") {
	global.db = db
}

export { db }
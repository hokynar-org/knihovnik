import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { DATABASE_URL } from "$env/static/private";

const db = global.db || drizzle(postgres(DATABASE_URL + "?sslmode=require"));

if (process.env.NODE_ENV === "development") {
  global.db = db;
}

export { db };

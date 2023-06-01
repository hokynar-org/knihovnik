import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import ws from "ws";
import "dotenv/config";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DB });
const db = drizzle(pool);

await migrate(db, { migrationsFolder: `${process.cwd()}/drizzle` });

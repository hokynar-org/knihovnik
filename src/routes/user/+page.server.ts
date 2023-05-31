import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import type { PageServerLoad } from './$types';
import { db } from '$env/static/private';
import { users } from '$lib/db/schema';

export const load = (async ({ }) => {
    console.log(db)
    const client = postgres(db+"?sslmode=require");
    const db_drizzle = drizzle(client);
    await db_drizzle.insert(users).values({ fullName: 'Andrew' });
    // const allUsers = await db_drizzle.select().from(users);
    return {
        user: "jebat"
    };
}) satisfies PageServerLoad;
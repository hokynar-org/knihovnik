import { drizzle } from 'drizzle-orm/postgres-js';
import {eq} from 'drizzle-orm'
import postgres from 'postgres';
import type { PageServerLoad } from './$types';
import { db_url } from '$env/static/private';
import { users } from '$lib/server/db/schema';

export const load = (async ({ }) => {
    console.log(db_url)
    const client = postgres(db_url+"?sslmode=require");
    console.log(client)
    const db_drizzle = drizzle(client);
    await db_drizzle.insert(users).values({ fullName: 'Beniš', phone: '731 803 674' });
    const allUsers = await db_drizzle.select().from(users);
    await db_drizzle.delete(users).where(eq(users.fullName, 'Beniš'));
    return {
        user: allUsers
    };
}) satisfies PageServerLoad;

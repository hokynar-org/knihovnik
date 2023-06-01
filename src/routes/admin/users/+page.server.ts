import { drizzle } from 'drizzle-orm/postgres-js';
import {eq} from 'drizzle-orm'
import postgres from 'postgres';
import type {Actions, PageServerLoad } from './$types';
import { db_url } from '$env/static/private';
import { users } from '$lib/server/db/schema';
import { fail, redirect } from "@sveltejs/kit"

export const load = (async ({ }) => {
    const client = postgres(db_url+"?sslmode=require");
    const db_drizzle = drizzle(client);
    const allUsers = await db_drizzle.select().from(users);
    return {
        users: allUsers
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
	deleteUser: async ({ url }) => {
        const client = postgres(db_url+"?sslmode=require");
        const db_drizzle = drizzle(client);
		const id = url.searchParams.get("id");
		if (!id) {
			return fail(400, { message: "Invalid request" })
		}
    
		try {
			await db_drizzle.delete(users).where(eq(users.id, Number(id)));
		} catch (err) {
			console.error(err)
			return fail(500, {
				message: "Database Error",
			})
		}
        throw redirect(303, '/admin/users');
        
		return {
			status: 200,
		}
	},
}
import {eq} from 'drizzle-orm';
import type {Actions, PageServerLoad } from './$types';
import { users } from '$lib/server/db/schema';
import {db} from '$lib/server/db/drizzle'
import { fail, redirect } from "@sveltejs/kit";

export const load = (async ({ }) => {
    const allUsers = await db.select().from(users);
    return {
        users: allUsers
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
	deleteUser: async ({ url }) => {
		const id = url.searchParams.get("id");
		if (!id) {
			return fail(400, { message: "Invalid request" })
		}
    
		try {
			await db.delete(users).where(eq(users.id, Number(id)));
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
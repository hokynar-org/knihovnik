import {eq} from 'drizzle-orm';
import type {Actions, PageServerLoad } from './$types';
import { sessions, users } from '$lib/server/db/schema';
import {db} from '$lib/server/db/drizzle'
import { fail, redirect } from "@sveltejs/kit";

export const load = (async ({ locals,parent }) => {
	await parent()
    if (!locals.user) {
		throw redirect(302, '/login')
	}
	else{
		if (locals.user.role!='ADMIN') {
			console.log(locals.user.role)
			throw redirect(302, '/')
		}
	}
    const allUsers = await db.select().from(users);
    return {
        users: allUsers
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
	delete_user: async ({ url, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/login')
		}
		const id = url.searchParams.get("id");
		if (!id) {
			return fail(400, { message: "Invalid request" })
		}
    
		try {
			await db.delete(sessions).where(eq(sessions.user_id, Number(id)));
			await db.delete(users).where(eq(users.id, Number(id)));
		} catch (err) {
			console.error(err)
			return fail(500, {
				message: "Database Error",
			})
		}
        throw redirect(303, '/admin/users');
	},
}
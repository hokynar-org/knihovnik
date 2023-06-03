import {eq} from 'drizzle-orm';
import type {Actions, PageServerLoad } from './$types';
import { sessions, users } from '$lib/server/db/schema';
import {db} from '$lib/server/db/drizzle'
import { fail, redirect } from "@sveltejs/kit";

export const load = (async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login')
	}
    const all_sessions = await db.select().from(sessions);
    return {
        sessions: all_sessions
    };
}) satisfies PageServerLoad;
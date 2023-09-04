import { error, fail, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/drizzle';
import {borrow_requests, communities, items, notifications, request_actions, user_community_relations, users} from '$lib/server/db/schema'
import { and, eq, or } from 'drizzle-orm';
import type { BorrowRequest, Item, PublicItemSafe,PublicUserSafe } from '$lib/types';
import { pusher } from '$lib/server/pusher';
import { user_select } from '$lib/server/db/selects';

export const POST = (async ({params, locals, url}) => {
    if (!locals.user) {
        throw error(401);
    }
    const user = locals.user;
    if(!params.user_name) {
        throw error(400);
    }
    const user_name=params.user_name;
    const results = await db.select(user_select).from(users).where(eq(users.user_name,user_name));
    return json(results);
}) satisfies RequestHandler;
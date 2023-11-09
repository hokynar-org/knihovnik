import { error, fail, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/drizzle';
import {borrow_requests, communities, items, notifications, request_actions, user_community_relations, users} from '$lib/server/db/schema'
import { and, eq, or } from 'drizzle-orm';
import type { BorrowRequest, Item, PublicItemSafe } from '$lib/types';
import { pusher } from '$lib/server/pusher';
import { notifyUser } from '$lib/server/notification';

export const POST = (async ({params, locals, url}) => {
    if (!locals.user) {
        throw error(401);
    }
    const user = locals.user;
    if(!params.community_id) {
        throw error(400);
    }
    const community_id=params.community_id;
    if(!params.user_id) {
        throw error(400);
    }
    const user_id=params.user_id;
    const results = await Promise.all([
        db.select().from(communities).where(eq(communities.id, community_id)),
        db.select().from(users).where(eq(users.id, user_id)),
        db.select().from(user_community_relations).where(and(eq(user_community_relations.community_id, community_id),eq(user_community_relations.user_id, user_id))),
        db.select().from(user_community_relations).where(and(eq(user_community_relations.community_id, community_id),eq(user_community_relations.user_id, user.id))),
    ])
    //  Community does not exist
    if (results[0].length==0){
        throw error(404);
    }
    const community=results[0][0];
    //  Accepted user does not exist
    if (results[1].length==0){
        throw error(404);
    }
    // Accepted user is not a member/admin/invited/requested
    if (results[2].length==0){
        throw error(400);
    }
    // This user is not a member/admin/invited/requested
    if(results[3].length==0){
        throw error(401);
    }
    // This user is not a admin
    if(results[3][0].role!='ADMIN'){
        throw error(401);
    }
    // Accepted user is not a requested
    if(results[2][0].role!='REQUESTED'){
        throw error(400);
    }
    const new_relations = (await db.update(user_community_relations).set({
        role: 'MEMBER',
    }).where(and(eq(user_community_relations.community_id, community_id),eq(user_community_relations.user_id, user_id))).returning())[0];
    await notifyUser({
        user_id: user_id,
        text: "User " + user.user_name + " accepted your request to join " + community.name+ " community",
        url: '/community/'+String(community_id)
    })

    return json(new_relations);
}) satisfies RequestHandler;
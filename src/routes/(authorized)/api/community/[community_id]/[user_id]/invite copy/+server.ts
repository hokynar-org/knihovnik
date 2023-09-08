import { error, fail, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from '../invite copy/$types';
import { db } from '$lib/server/db/drizzle';
import {borrow_requests, communities, items, notifications, request_actions, user_community_relations, users} from '$lib/server/db/schema'
import { and, eq, or } from 'drizzle-orm';
import type { BorrowRequest, Item, PublicItemSafe } from '$lib/types';
import { pusher } from '$lib/server/pusher';

export const POST = (async ({params, locals, url}) => {
    if (!locals.user) {
        throw error(401);
    }
    const user = locals.user;
    if(!params.community_id) {
        throw error(400);
    }
    const community_id=Number(params.community_id);
    if(!params.user_id) {
        throw error(400);
    }
    const user_id=Number(params.user_id);
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
    //  Invited user does not exist
    if (results[1].length==0){
        throw error(404);
    }
    // Invited user is already a member/admin/invited/requested
    if (results[2].length!=0){
        throw error(400);
    }
    // This user is not a member/admin
    if(results[3].length==0){
        throw error(401);
    }
    // This user is not a admin
    if(results[3][0].role!='ADMIN'){
        throw error(401);
    }
    const new_relations = (await db.insert(user_community_relations).values({
        community_id: community_id,
        user_id: user_id,
        role: 'INVITED',
    }).returning())[0];
    const notification = await db.insert(notifications).values({
            user_id: user_id,
            text: "User " + user.user_name + " invited you to " + community.name,
            url: '/community/'+String(community_id),
        }).returning();
    await pusher.sendToUser(String(user_id), "notification", notification[0]);

    return json(new_relations);
}) satisfies RequestHandler;
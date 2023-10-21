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
    //  Promoted user does not exist
    if (results[1].length==0){
        throw error(404);
    }
    // Promoted user is not a member/admin
    if (results[2].length==0){
        throw error(400);
    }
    // This user is not a member/admin
    if(results[3].length==0){
        throw error(401);
    }
    // This user is not an admin
    if(results[3][0].role!='ADMIN'){
        throw error(401);
    }
    // Promoted user is allready an admin
    if(results[2][0].role!='MEMBER'){
        throw error(400);
    }

    const new_relations = (await db.update(user_community_relations).set({
        role:'ADMIN',
    }).where(and(eq(user_community_relations.community_id, community_id),eq(user_community_relations.user_id, user_id))).returning())[0];

    await notifyUser({
        user_id: user_id,
        text: "User " + user.user_name + " promoted you to admin of " + community.name+ " community",
        url: '/community/'+String(community_id)
    })

    return json(new_relations);
}) satisfies RequestHandler;
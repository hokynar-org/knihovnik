import { error, fail, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/drizzle';
import {borrow_requests, communities, items, notifications, request_actions, user_community_relations, users} from '$lib/server/db/schema'
import { and, asc, eq, or } from 'drizzle-orm';
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
    const results = await Promise.all([
        db.select().from(communities).where(eq(communities.id, community_id)),
        db.select().from(user_community_relations).where(and(eq(user_community_relations.community_id, community_id),eq(user_community_relations.user_id, user.id))),
    ]);
    //  Community does not exist
    if (results[0].length==0){
        throw error(404);
    }
    const community=results[0][0];
    //  User relation does not exist
    if (results[1].length==0){
        throw error(400);
    }
    // This user is not a MEMBER or an ADMIN 
    if(results[1][0].role!='MEMBER' && results[1][0].role!='ADMIN'){
        throw error(400);
    }
    const deleted_relation = (await db.delete(user_community_relations).where(and(eq(user_community_relations.community_id, community_id),eq(user_community_relations.user_id, user.id))).returning())[0];
    const new_relations = (await db.select().from(user_community_relations).orderBy(asc(user_community_relations.timestamp)).where(eq(user_community_relations.community_id, community_id)));
    const new_admin_relations = await db.select().from(user_community_relations).where(and(eq(user_community_relations.community_id, community_id),eq(user_community_relations.role,'ADMIN')));
    if (new_relations.length==0){
        await db.delete(communities).where(eq(communities.id, community_id));
    }
    else if(new_admin_relations.length==0){
        await db.update(user_community_relations).set({
            role: 'ADMIN',
        }).where(and(eq(user_community_relations.community_id, community_id),eq(user_community_relations.user_id, new_relations[0].user_id)));
    }

    // const notification = await db.insert(notifications).values({
    //         user_id: user_id,
    //         text: "User " + user.user_name + " invited you to " + community.name,
    //         url: '/community/'+String(community_id),
    //     }).returning();
    // await pusher.sendToUser(String(user_id), "notification", notification[0]);
    
    return json(deleted_relation);
}) satisfies RequestHandler;
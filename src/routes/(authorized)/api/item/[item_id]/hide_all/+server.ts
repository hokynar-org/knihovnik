import { error, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/drizzle';
import {borrow_requests, communities, item_visibility, items, user_community_relations} from '$lib/server/db/schema'
import { eq, and, inArray } from 'drizzle-orm';
import type { Item, PublicItemSafe } from '$lib/types';
import { item_select } from '$lib/server/db/selects';

export const POST = (async ({locals, params,url}) => {
    if (!locals.user) {
        throw error(401);
    }
    const user = locals.user;
    if (!Number(params.item_id)) {
        throw error(400);
    }
    const item_id = Number(params.item_id);
    const results = await Promise.all([
        db.select({item:item_select}).from(items).where(eq(items.id,item_id)),
        db.select({community:communities,
                    relation:user_community_relations,
                    visibility:item_visibility,
        }).from(communities)
        .innerJoin(user_community_relations,and(eq(user_community_relations.community_id, communities.id),eq(user_community_relations.user_id, user.id)))
        .leftJoin(item_visibility,and(eq(item_visibility.community_id, communities.id),eq(item_visibility.item_id, item_id))),
    ])
    
    if (results[0].length == 0) {
        throw error(404);
    }
    const item = results[0][0].item;
    if (item.owner_id != locals.user.id) {
        throw error(401);
    }
    if (item.owner_id != item.holder_id) {
        throw error(400);
    }
    const user_communities = results[1];
    const user_authorized_communities = user_communities.filter((value)=>{return value.relation.role=='ADMIN'||value.relation.role=='MEMBER'});

    if(user_authorized_communities.length==0){
        throw error(400);
    }
    const visible_communities=user_authorized_communities.filter((value)=>{ return value.visibility});
    if(visible_communities.length==0){
        throw error(400);
    }
    const community_id_arr = visible_communities.flatMap((value)=>{return value.community.id})
    try{
        const deleted_visibilities = await db.delete(item_visibility).where(and(inArray(item_visibility.community_id,community_id_arr),eq(item_visibility.item_id,item.id))).returning();
        return json(deleted_visibilities);
    }
    catch{
        throw error(500)
    }

}) satisfies RequestHandler;
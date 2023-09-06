import { error, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/drizzle';
import {borrow_requests, item_visibility, items} from '$lib/server/db/schema'
import { eq, and } from 'drizzle-orm';
import type { Item, PublicItemSafe } from '$lib/types';
import { item_select } from '$lib/server/db/selects';

export const POST = (async ({locals, params,url}) => {
    if (!locals.user) {
        throw error(401);
    }
    if (!params.item_id) {
        throw error(400);
    }
    if (!params.community_id) {
        throw error(400);
    }
    const item_id=Number(params.item_id);
    const community_id= Number(params.community_id);
    const results = await db
        .select({item:item_select,item_visibility:item_visibility})
        .from(items)
        .where(eq(items.id, item_id))
        .leftJoin(item_visibility,and(eq(item_visibility.item_id,items.id),eq(item_visibility.community_id,community_id)));
    if (results.length == 0) {
        throw error(404);
    }
    const item = results[0].item;
    const visibility = results[0].item_visibility;
    if (item.owner_id != locals.user.id) {
        throw error(401);
    }
    try{
        if(!visibility){
            const new_visibility = await db.insert(item_visibility).values({item_id:item_id,community_id:community_id}).returning();
            return json(new_visibility);
        }
        else{
            await db.delete(item_visibility).where(and(eq(item_visibility.item_id,item_id),eq(item_visibility.community_id,community_id)));
            return json(null);
        }
    }
    catch{
        throw error(500)
    }

}) satisfies RequestHandler;
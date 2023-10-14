import { error, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/drizzle';
import {borrow_requests, items} from '$lib/server/db/schema'
import { eq } from 'drizzle-orm';
import type { Item, PublicItemSafe } from '$lib/types';
import { item_select } from '$lib/server/db/selects';

export const POST = (async ({locals, params}) => {
    if (!locals.user) {
        throw error(401);
    }
    if (!params.item_id) {
        throw error(400);
    }
    const item_id=params.item_id;
    const found_items = await db
        .select(item_select)
        .from(items)
        .where(eq(items.id, Number(item_id)));
    if (found_items.length == 0) {
        throw error(404);
    }
    const item = found_items[0];
    if(item.transfeType==="TRANSITIVE"){
        if(item.owner_id != locals.user.id && item.holder_id != locals.user.id){
            throw error(403);
        }
    } else {
        if(item.owner_id != locals.user.id){
            throw error(403);
        }
        if(item.holder_id != item.owner_id) {
            throw error(400);
        }
    }
    const new_offered= !item.offered;
    try{
        await db.update(items).set({offered:new_offered}).where(eq(items.id, Number(item_id))).returning(
            {offered:items.offered},
        );
        return json(new_offered);
    }
    catch{
        throw error(500)
    }

}) satisfies RequestHandler;
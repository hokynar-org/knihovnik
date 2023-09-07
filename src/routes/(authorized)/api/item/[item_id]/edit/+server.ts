import { error, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/drizzle';
import {borrow_requests, item_visibility, items} from '$lib/server/db/schema'
import { eq } from 'drizzle-orm';
import type { Item } from '$lib/types';
import { item_select } from '$lib/server/db/selects';

export const POST = (async ({locals, params, request}) => {
    if (!locals.user) {
        throw error(401);
    }
    if (!params.item_id) {
        throw error(400);
    }
    const item_id=params.item_id;
    const found_items = await db
        .select()
        .from(items)
        .where(eq(items.id, Number(item_id)));
    if (found_items.length == 0) {
        throw error(404);
    }
    const item = found_items[0];
    if (item.owner_id != locals.user.id) {
        throw error(401);
    }
    const new_item:{name:string, description:string} = await request.json();
    if(!new_item.name || !new_item.description){

    }
    const updated_item = (await db.update(items).set({name:new_item.name,description:new_item.description}).where(eq(borrow_requests.item_id, Number(item_id))).returning(item_select))[0];

    return json(updated_item);
}) satisfies RequestHandler;
import { error, fail, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/drizzle';
import {borrow_requests, items} from '$lib/server/db/schema'
import { and, eq } from 'drizzle-orm';
import type { BorrowRequest, Item } from '$lib/types';

export const POST = (async ({ locals, url}) => {
    if (!locals.user) {
        throw error(401);
    }
    const user = locals.user;
    const item_id = url.searchParams.get('item_id');
    if(!item_id){
        throw error(400);
    }
    const found_items = await db.select().from(items).where(eq(items.id, Number(item_id)));
    if(found_items.length==0){
        throw error(400);
    }
    const item = found_items[0];
    if(item.holder_id==user.id){
        throw error(400);
    }
    const found_borrow_requests:Array<BorrowRequest> =
    await db.select().from(borrow_requests).where(and(eq(borrow_requests.item_id, Number(item.id)),eq(borrow_requests.borrower_id, Number(user.id))));
    if(found_borrow_requests.length>0) {
        throw error(400);
    }
    const new_borrow_requests = await db.insert(borrow_requests).values({
        lender_id: item.holder_id as number,
        borrower_id: user.id as number,
        item_id: item.id as number,
      }).returning();
    const borrow_request=new_borrow_requests[0];
    return json(borrow_request);
}) satisfies RequestHandler;
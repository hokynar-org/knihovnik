import { error, fail, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/drizzle';
import {borrow_requests, items, notifications, request_actions, users} from '$lib/server/db/schema'
import { and, eq } from 'drizzle-orm';
import type { BorrowRequest, Item, PublicItemSafe } from '$lib/types';
import { pusher } from '$lib/server/pusher';

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
    const new_borrow_requests:BorrowRequest[] = await db.insert(borrow_requests).values({
        lender_id: item.holder_id as number,
        borrower_id: user.id as number,
        item_id: item.id as number,
        }).returning();
    const borrow_request:BorrowRequest=new_borrow_requests[0];
    await db.insert(request_actions).values({
        borrow_request_id:borrow_request.id,
        user_id:user.id,
        type: 'CREATE',
        message: '',
        }).returning();
    const notification = await db.insert(notifications).values({
            user_id: borrow_request.lender_id,
            text: "User " + locals.user.user_name + " wants " + item.name,
            url: '/borrow_request/'+String(borrow_request.id),
          }).returning();
    pusher.sendToUser(String(borrow_request.lender_id), "notification", notification[0]);

    return json(borrow_request);
}) satisfies RequestHandler;
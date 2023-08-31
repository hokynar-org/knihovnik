import { error, fail, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/drizzle';
import {borrow_requests, items, notifications, request_actions} from '$lib/server/db/schema'
import { eq } from 'drizzle-orm';
import type { BorrowRequest, Notification, PublicItemSafe, RequestAction } from '$lib/types';
import { pusher } from '$lib/server/pusher';

export const POST = (async ({ request, params, locals, url, route }) => {
  if (!locals.user) {
    throw error(401);
  }
  if (!params.borrow_request_id) {
    throw error(400);
  }
  const body = await (await request).json()
  const message = body.message;
  const user_id = locals.user.id;
  const borrow_request_id = params.borrow_request_id as string;
  const found_borrow_requests:{item:PublicItemSafe,borrow_request:BorrowRequest}[] = await db.select({
    item: {
      name: items.name,
      description: items.description,
      id: items.id,
      owner_id: items.owner_id,
    },
    borrow_request: {
      status: borrow_requests.status,
      id: borrow_requests.id,
      borrower_id: borrow_requests.borrower_id,
      lender_id: borrow_requests.lender_id,
      item_id: borrow_requests.item_id,
      timestamp: borrow_requests.timestamp,
    },}).from(borrow_requests).where(eq(borrow_requests.id, Number(borrow_request_id))).innerJoin(items,eq(items.id,borrow_requests.item_id));
  if(found_borrow_requests.length==0) {
    throw error(400);
  }

  const borrow_request=found_borrow_requests[0].borrow_request;
  if(borrow_request.status!='ACCEPTED') {
    throw error(401);
  }
  const item = found_borrow_requests[0].item;
  if(borrow_request.lender_id!=user_id && borrow_request.borrower_id!=user_id){
    throw error(401);
  }
  try {
    const new_requests_actions:Promise<RequestAction[]> = db.insert(request_actions).values({
      borrow_request_id:Number(borrow_request_id),
      user_id:user_id,
      type: 'MESSAGE',
      message: message,
      }).returning();
    const message_notification:Promise<Notification[]> = db.insert(notifications).values({
        user_id: user_id==borrow_request.lender_id?borrow_request.borrower_id:borrow_request.lender_id,
        text: "User " + locals.user.user_name + " messaged you concerning " + item.name,
        url: '/borrow_request/'+String(borrow_request.id),
      }).returning();
    const results:[RequestAction[],Notification[]] = await Promise.all([new_requests_actions,message_notification]);
    await pusher.sendToUser(String(user_id==borrow_request.lender_id?borrow_request.borrower_id:borrow_request.lender_id), "notification", results[1][0]);
    await pusher.trigger('private-borrow_request-' + borrow_request_id,'request_action',{borrow_request:undefined,action:results[0][0]})
    return json(results[0][0]);
  } catch (err) {
    throw error(500);
  }
}) satisfies RequestHandler;
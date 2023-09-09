import { error, fail, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/drizzle';
import {borrow_requests, items, notifications, request_actions} from '$lib/server/db/schema'
import { eq } from 'drizzle-orm';
import type { BorrowRequest } from '$lib/types';
import { pusher } from '$lib/server/pusher';
import { borrow_request_select, item_select } from '$lib/server/db/selects';
export const POST = (async ({ request, params, locals, url, route }) => {
  if (!locals.user) {
    throw error(401);
  }
  if (!params.borrow_request_id) {
    throw error(400);
  }
  const user_id = locals.user.id;
  const user = locals.user;
  const borrow_request_id = params.borrow_request_id as string;
  const found_borrow_requests =
  await db.select({
    item: item_select,
    borrow_request: borrow_request_select,
  }).from(borrow_requests).where(eq(borrow_requests.id, Number(borrow_request_id))).innerJoin(items,eq(items.id,borrow_requests.item_id));
  if(found_borrow_requests.length==0) {
    throw error(400);
  }
  const old_borrow_request=found_borrow_requests[0].borrow_request;
  const item = found_borrow_requests[0].item
  if(old_borrow_request.status!='PENDING'){
    throw error(400);
  }
  if(old_borrow_request.lender_id!=user_id){
    throw error(401);
  }
  try {
    const new_borrow_requests = db.update(borrow_requests).set({status:'ACCEPTED'}).where(eq(borrow_requests.id, Number(borrow_request_id))).returning();
    const new_requests_actions = db.insert(request_actions).values({
      borrow_request_id:Number(borrow_request_id),
      user_id:user_id,
      type: 'ACCEPT',
      message: '',
      }).returning();
    const accept_notification:Promise<any> = db.insert(notifications).values({
        user_id: old_borrow_request.borrower_id,
        text: "User " + locals.user.user_name + " accepted your request for " + item.name,
        url: '/borrow_request/'+String(old_borrow_request.id),
      }).returning();
    const results=await Promise.all([new_borrow_requests,new_requests_actions,accept_notification]);
    await pusher.sendToUser(String(old_borrow_request.borrower_id), "notification", results[2][0]);
    const request_action_message = {
      ...results[1][0],
      user_name:user.user_name,
    }
    await pusher.trigger('private-borrow_request-' + borrow_request_id,'request_action',{borrow_request:results[0][0],action:request_action_message})
    return json({borrow_request:results[0][0],action:request_action_message});
  } catch (err) {
    throw error(500);
  }
}) satisfies RequestHandler;
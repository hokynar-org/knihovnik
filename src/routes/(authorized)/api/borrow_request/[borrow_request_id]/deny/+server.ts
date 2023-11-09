import { error, fail, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/drizzle';
import {borrow_requests, items, notifications, request_actions} from '$lib/server/db/schema'
import { eq } from 'drizzle-orm';
import type { BorrowRequest } from '$lib/types';
import {pusher} from '$lib/server/pusher';
import { borrow_request_select, item_select } from '$lib/server/db/selects';
import { notifyUser } from '$lib/server/notification';

export const POST = (async ({ request, params, locals, url, route }) => {
  if (!locals.user) {
    throw error(401);
  }
  if (!params.borrow_request_id) {
    throw error(400);
  }
  const user_id = locals.user.id;
  const user = locals.user;
  const borrow_request_id = params.borrow_request_id;
  const found_borrow_requests =
  await db.select({
    item: item_select,
    borrow_request: borrow_request_select,
  }).from(borrow_requests).where(eq(borrow_requests.id, borrow_request_id)).innerJoin(items,eq(items.id,borrow_requests.item_id));
  if(found_borrow_requests.length==0) {
    throw error(400);
  }
  const old_borrow_request=found_borrow_requests[0].borrow_request;
  const item = found_borrow_requests[0].item;
  if(old_borrow_request.status!='PENDING'){
    throw error(400);
  }
  if(old_borrow_request.lender_id!=user_id){
    throw error(401);
  }
  try {
    const [borrow_request,action] = await db.transaction(async (tx)=>{
      const [borrow_request] = await tx.update(borrow_requests).set({
          status: 'DENIED',
          }).where(eq(borrow_requests.id, borrow_request_id)).returning();
      const [action] = await tx.insert(request_actions).values({
          borrow_request_id:borrow_request.id,
          user_id:user.id,
          type: 'DENY',
          message: '',
          }).returning();
      return [borrow_request,action]
    });
    await notifyUser({
        user_id: old_borrow_request.borrower_id,
        text: "User " + locals.user.user_name + " denied your request for " + item.name,
        url: '/borrow_request/'+String(old_borrow_request.id),
      })
    const request_action_message = {
      ...action,
      user_name:user.user_name,
    }
    await pusher.trigger('private-borrow_request-' + borrow_request_id,'request_action',{borrow_request:borrow_request,action:request_action_message})
    return json({borrow_request:borrow_request,action:request_action_message});
  } catch (err) {
    throw error(500);
  }
}) satisfies RequestHandler;
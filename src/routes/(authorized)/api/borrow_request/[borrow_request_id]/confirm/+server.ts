import { error, fail, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/drizzle';
import {borrow_requests, items, notifications, request_actions} from '$lib/server/db/schema'
import { eq,and } from 'drizzle-orm';
import type { BorrowRequest, PublicItemSafe, RequestAction } from '$lib/types';
import { pusher } from '$lib/server/pusher';

export const POST = (async ({ request, params, locals, url, route }) => {
  if (!locals.user) {
    throw error(401);
  }
  if (!params.borrow_request_id) {
    throw error(400);
  }
  const user_id = locals.user.id;
  const borrow_request_id = params.borrow_request_id as string;
  const found_borrow_requests_promise =
    db.select({
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
      },})
      .from(borrow_requests).where(eq(borrow_requests.id, Number(borrow_request_id)))
      .innerJoin(items,eq(items.id,borrow_requests.item_id));
  
  const request_actions_promise= await db.select().from(request_actions)
    .where(and(eq(request_actions.borrow_request_id,Number(borrow_request_id)),eq(request_actions.type,'CONFIRM')));
  
  const state_results:[{borrow_request:BorrowRequest,item:PublicItemSafe}[],RequestAction[]]
  = await Promise.all([found_borrow_requests_promise,request_actions_promise]);

  const found_borrow_requests = state_results[0];
  const found_confirm_actions = state_results[1];
  if(found_borrow_requests.length==0) {
    throw error(400);
  }

  const old_borrow_request=found_borrow_requests[0].borrow_request;
  const item = found_borrow_requests[0].item

  if(old_borrow_request.status!='ACCEPTED'){
    throw error(400);
  }

  const user_ids=[old_borrow_request.lender_id,old_borrow_request.borrower_id];

  if(!user_ids.includes(user_id)){
    throw error(401);
  }

  const other_user_id:number=user_ids[(user_ids.indexOf(user_id)+1)%2]

  if(found_confirm_actions.length==1 && found_confirm_actions[0].user_id==user_id){
    throw error(400);
  }
  
  try {
    const new_requests_actions:Promise<RequestAction[]> = db.insert(request_actions).values({
      borrow_request_id:Number(borrow_request_id),
      user_id:user_id,
      type: 'CONFIRM',
      message: '',
      }).returning();
    if(found_confirm_actions.length==0){
      const confirm_notification:Promise<any> = db.insert(notifications).values({
          user_id: other_user_id,
          text: "User " + locals.user.user_name + " confirmed hand over of " + item.name,
          url: '/borrow_request/'+String(old_borrow_request.id),
        }).returning();
      const results=await Promise.all([new_requests_actions,confirm_notification]);
      await pusher.sendToUser(String(other_user_id), "notification", results[1][0]);
      await pusher.trigger('private-borrow_request-' + borrow_request_id,'request_action',{borrow_request:undefined,action:results[0][0]});
      return json(old_borrow_request);
    }
    else if(found_confirm_actions.length==1){
      const new_borrow_requests = db.update(borrow_requests).set({status:'CONFIRMED'}).where(eq(borrow_requests.id, Number(borrow_request_id))).returning();
      const confirm_notification:Promise<any> = db.insert(notifications).values({
        user_id: other_user_id,
        text: "User " + locals.user.user_name + " confirmed hand over of " + item.name,
        url: '/borrow_request/'+String(old_borrow_request.id),
      }).returning();
      const new_item = db.update(items).set({holder_id:old_borrow_request.borrower_id}).where(eq(items.id, old_borrow_request.item_id)).returning();
      const results=await Promise.all([new_borrow_requests,new_requests_actions,confirm_notification,new_item]);
      await pusher.sendToUser(String(other_user_id), "notification", results[2][0]);
      await pusher.trigger('private-borrow_request-' + borrow_request_id,'request_action',{borrow_request:results[0][0],action:results[1][0]});
      return json(results[0][0]);
    }
    else{
      throw error(400);
    }
  } catch (err) {
    throw error(500);
  }
}) satisfies RequestHandler;
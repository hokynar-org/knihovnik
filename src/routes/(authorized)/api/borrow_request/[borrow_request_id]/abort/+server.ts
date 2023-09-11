import { error, fail, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/drizzle';
import {borrow_requests, items, notifications, request_actions} from '$lib/server/db/schema'
import { eq,and } from 'drizzle-orm';
import type { BorrowRequest, PublicItemSafe, RequestAction } from '$lib/types';
import { pusher } from '$lib/server/pusher';
import { borrow_request_select, item_select } from '$lib/server/db/selects';
export const POST = (async ({ request, params, locals, url, route }) => {
  // This user is not logged in
  if (!locals.user) {
    throw error(401);
  }
  if (!params.borrow_request_id) {
    throw error(400);
  }
  const user_id = locals.user.id;
  const user=locals.user;
  const borrow_request_id = params.borrow_request_id as string;
  const found_borrow_requests_promise =
    db.select({
      item: item_select,
      borrow_request: borrow_request_select,
    })
      .from(borrow_requests).where(eq(borrow_requests.id, Number(borrow_request_id)))
      .innerJoin(items,eq(items.id,borrow_requests.item_id));
  
  const request_actions_promise= await db.select().from(request_actions)
    .where(and(eq(request_actions.borrow_request_id,Number(borrow_request_id)),eq(request_actions.type,'CONFIRM')));
  
  const state_results:[{borrow_request:BorrowRequest,item:PublicItemSafe}[],RequestAction[]]
  = await Promise.all([found_borrow_requests_promise,request_actions_promise]);

  const found_borrow_requests = state_results[0];
  const found_confirm_actions = state_results[1];

  // There is no borrow_request
  if(found_borrow_requests.length==0) {
    throw error(400);
  }

  const old_borrow_request=found_borrow_requests[0].borrow_request;
  const item = found_borrow_requests[0].item

  // Only ACCEPTED request can be aborted
  if(old_borrow_request.status!='ACCEPTED'){
    throw error(400);
  }

  const user_ids=[old_borrow_request.lender_id,old_borrow_request.borrower_id];

  // Only lender or borrower can be abort
  if(!user_ids.includes(user_id)){
    throw error(401);
  }

  const other_user_id:number=user_ids[(user_ids.indexOf(user_id)+1)%2]

  // This user has allready confirmed and can not abort
  if(found_confirm_actions.length==1 && found_confirm_actions[0].user_id==user_id){
    throw error(400);
  }

  if((old_borrow_request.borrower_id==item.owner_id && user.id!=item.owner_id)){
    throw error(401);
  }
  
  try {
    const new_requests_actions:Promise<RequestAction[]> = db.insert(request_actions).values({
      borrow_request_id:Number(borrow_request_id),
      user_id:user_id,
      type: 'ABORT',
      message: '',
      }).returning();
    const new_borrow_requests = db.update(borrow_requests).set({status:'ABORTED'}).where(eq(borrow_requests.id, Number(borrow_request_id))).returning();
    const abort_notification:Promise<any> = db.insert(notifications).values({
        user_id: other_user_id,
        text: "User " + locals.user.user_name + " aborted hand over of " + item.name,
        url: '/borrow_request/'+String(old_borrow_request.id),
      }).returning();
    const results=await Promise.all([new_requests_actions,abort_notification,new_borrow_requests]);
    await pusher.sendToUser(String(other_user_id), "notification", results[1][0]);
    const request_action_message = {
      ...results[0][0],
      user_name:user.user_name,
    }
    await pusher.trigger('private-borrow_request-' + borrow_request_id,'request_action',{borrow_request:results[2][0],action:request_action_message});
    return json({borrow_request:results[2][0],action:request_action_message});
  }
  catch (err) {
    throw error(500);
  }
}) satisfies RequestHandler;
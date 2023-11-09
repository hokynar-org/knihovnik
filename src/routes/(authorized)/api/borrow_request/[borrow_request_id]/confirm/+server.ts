import { error, fail, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/drizzle';
import {borrow_requests, items, notifications, request_actions} from '$lib/server/db/schema'
import { eq,and } from 'drizzle-orm';
import type { BorrowRequest, PublicItemSafe, RequestAction } from '$lib/types';
import { pusher } from '$lib/server/pusher';
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
  const user=locals.user;
  const borrow_request_id = params.borrow_request_id;
  const found_borrow_requests_promise =
    db.select({
      item: item_select,
      borrow_request: borrow_request_select,
    })
      .from(borrow_requests).where(eq(borrow_requests.id, borrow_request_id))
      .innerJoin(items,eq(items.id,borrow_requests.item_id));
  
  const request_actions_promise= await db.select().from(request_actions)
    .where(and(eq(request_actions.borrow_request_id,borrow_request_id),eq(request_actions.type,'CONFIRM')));
  
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

  const other_user_id=user_ids[(user_ids.indexOf(user_id)+1)%2]

  if(found_confirm_actions.length==1 && found_confirm_actions[0].user_id==user_id){
    throw error(400);
  }
  
  try {
    if(found_confirm_actions.length==1 || (old_borrow_request.borrower_id==item.owner_id && user.id==item.owner_id) ){
      const [borrow_request,action] = await db.transaction(async (tx)=>{
        const [borrow_request] = await tx.update(borrow_requests).set({
            status: 'CONFIRMED',
            }).where(eq(borrow_requests.id, borrow_request_id)).returning();
        const [action] = await tx.insert(request_actions).values({
            borrow_request_id:borrow_request.id,
            user_id:user.id,
            type: 'CONFIRM',
            message: '',
            }).returning();
        if(item.transfeType=="GIVE"){
          await tx.update(items).set({
            holder_id:borrow_request.borrower_id,
            offered:false,
            owner_id:borrow_request.borrower_id,
          }).where(eq(items.id, borrow_request.item_id)).returning();
        }
        else{
          await tx.update(items).set({
            holder_id:borrow_request.borrower_id,
            offered:false
          }).where(eq(items.id, borrow_request.item_id)).returning();
        }
        return [borrow_request,action]
      });
      await notifyUser({
        user_id: other_user_id,
        text: "User " + locals.user.user_name + " confirmed hand over of " + item.name,
        url: '/borrow_request/'+String(old_borrow_request.id),
      })
      const request_action_message = {
        ...action,
        user_name:user.user_name,
      }
      await pusher.trigger('private-borrow_request-' + String(borrow_request_id),'request_action',{borrow_request:borrow_request,action:request_action_message});
      return json({borrow_request:borrow_request,action:request_action_message});
    }
    else if(found_confirm_actions.length==0){
      const [action] = await db.transaction(async (tx)=>{
        const [action] = await tx.insert(request_actions).values({
            borrow_request_id:old_borrow_request.id,
            user_id:user.id,
            type: 'CONFIRM',
            message: '',
            }).returning();
        return [action]
      });
      await notifyUser({
        user_id: other_user_id,
        text: "User " + locals.user.user_name + " confirmed hand over of " + item.name,
        url: '/borrow_request/'+String(old_borrow_request.id),
      })
      const request_action_message = {
        ...action,
        user_name:user.user_name,
      }
      await pusher.trigger('private-borrow_request-' + String(borrow_request_id),'request_action',{borrow_request:undefined,action:request_action_message});
      return json({borrow_request:old_borrow_request,action:request_action_message});
    }
    else{
      throw error(400);
    }
  } catch (err) {
    throw error(500);
  }
}) satisfies RequestHandler;
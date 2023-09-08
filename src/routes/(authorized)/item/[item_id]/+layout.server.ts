import { error, redirect } from '@sveltejs/kit';
import { borrow_requests, communities, item_visibility, items, user_community_relations, users } from '$lib/server/db/schema';
import { db } from '$lib/server/db/drizzle';
import { and, eq, or } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';
import type { BorrowRequest, Offer, PublicItemSafe,PublicUserSafe } from '$lib/types';
import { alias } from 'drizzle-orm/pg-core';
import { getFileUrl } from '$lib/server/bucket';
import { getItem } from '$lib/server/item_load';

export const load: LayoutServerLoad = (async ({ locals, params }) => {
  if(!params.item_id){
    throw error(400)
  }
  if(!locals.user){
    redirect(301,"/")
  }
  const item_id = Number(params.item_id);
  const user=locals.user;
  const results = await Promise.all([getItem(item_id),db.select().from(user_community_relations).where(and(eq(user_community_relations.user_id, user.id),or(eq(user_community_relations.role, 'ADMIN'),eq(user_community_relations.role, 'MEMBER')))).innerJoin(communities,eq(user_community_relations.community_id,communities.id)).leftJoin(item_visibility,and(eq(item_visibility.item_id, item_id),eq(item_visibility.community_id,user_community_relations.community_id)))]);
  const item_result=results[0];
  const community_visibility=results[1];
  if(!item_result){
    throw error(404)
  }
  const item = item_result.item;
  const owner = item_result.owner;
  const holder = item_result.holder;
  if(community_visibility.filter((value)=>{return !!value.item_visibility}).length==0 && owner.id!=user.id && holder.id!=user.id){
    throw error(401)
  }
  const maybe_last_requsts = item_result.borrow_requests.filter((value)=>{
    return (value.borrow_request.borrower_id==user.id && value.borrow_request.lender_id==holder.id) &&
    (value.borrow_request.status == 'PENDING' || value.borrow_request.status == 'ACCEPTED')
  })
  const last_requst= maybe_last_requsts.length>0?maybe_last_requsts[0]:null
  if(user.id==owner.id){
    return {
      item:item, holder: holder, owner:owner, last_requst:last_requst,
      borrow_requests:item_result.borrow_requests,
      community_visibility:community_visibility,
    };
  }
  else if(user.id==holder.id){
    return {
      item:item, holder: holder, owner:owner, last_requst:last_requst,
      borrow_requests:item_result.borrow_requests.filter((value)=>{
        return user.id==value.borrow_request.borrower_id || user.id==value.borrow_request.lender_id;
      }),
      community_visibility:community_visibility,
    }
  }
  else{
    return {
      item:item, owner:owner, last_requst:last_requst, holder:null,
      borrow_requests:item_result.borrow_requests.filter((value)=>{
        return user.id==value.borrow_request.borrower_id || user.id==value.borrow_request.lender_id;
      }),
      community_visibility:community_visibility,
    }
  }
}) satisfies LayoutServerLoad;

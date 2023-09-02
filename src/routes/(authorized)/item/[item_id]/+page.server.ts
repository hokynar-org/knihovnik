import { error, redirect } from '@sveltejs/kit';
import { borrow_requests, items, users } from '$lib/server/db/schema';
import { db } from '$lib/server/db/drizzle';
import { and, eq, or } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { BorrowRequest, Offer, PublicItemSafe,PublicUserSafe } from '$lib/types';
import { alias } from 'drizzle-orm/pg-core';
import { getFileUrl } from '$lib/server/bucket';
import { getItem } from '$lib/server/item_load';

export const load: PageServerLoad = (async ({ locals, params }) => {
  if(!params.item_id){
    throw error(400)
  }
  if(!locals.user){
    redirect(301,"/")
  }
  const item_id = Number(params.item_id);
  const user=locals.user;
  const result = await getItem(item_id);
  if(!result){
    throw error(404)
  }
  const item = result.item;
  const owner = result.owner;
  const holder = result.holder;
  const maybe_last_requsts = result.borrow_requests.filter((value)=>{
    return (value.borrow_request.borrower_id==user.id && value.borrow_request.lender_id==holder.id) &&
    (value.borrow_request.status == 'PENDING' || value.borrow_request.status == 'ACCEPTED')
  })
  const last_requst= maybe_last_requsts.length>0?maybe_last_requsts[0]:null
  if(user.id==owner.id){
    return {
      item:item, holder: holder, owner:owner, last_requst:last_requst,
      borrow_requests:result.borrow_requests
    };
  }
  else if(user.id==holder.id){
    return {
      item:item, holder: holder, owner:owner, last_requst:last_requst,
      borrow_requests:result.borrow_requests.filter((value)=>{
        return user.id==value.borrow_request.borrower_id || user.id==value.borrow_request.lender_id;
      })
    }
  }
  else{
    return {
      item:item, owner:owner, last_requst:last_requst, holder:null,
      borrow_requests:result.borrow_requests.filter((value)=>{
        return user.id==value.borrow_request.borrower_id || user.id==value.borrow_request.lender_id;
      })
    }
  }
}) satisfies PageServerLoad;

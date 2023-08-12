import { db } from '$lib/server/db/drizzle';
import { borrow_requests, request_actions, items, users, notifications } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { BorrowRequest, PublicItemSafe, PublicUserSafe, RequestAction } from '$lib/types';
import { alias } from 'drizzle-orm/pg-core';
import { error, redirect } from '@sveltejs/kit';

export const load = (async ({ locals,params, url}) => {
  if(!params.borrow_request_id){
    throw error(404);
  }
  const borrow_request_id=Number(params.borrow_request_id)
  const borrower = alias(users, "borrower");
  const lender = alias(users, "lender");
  const owner = alias(users, "owner");

  const borrow_request_reusults:Promise<{
    borrower:PublicUserSafe,
    lender:PublicUserSafe,
    owner:PublicUserSafe,
    item:PublicItemSafe,
    borrow_request:BorrowRequest
  }[]>
   = db
  .select({
    borrower: {
      id: borrower.id,
      full_name: borrower.full_name,
      user_name: borrower.user_name,
      pronouns: borrower.pronouns,
    },
    lender: {
      id: lender.id,
      full_name: lender.full_name,
      user_name: lender.user_name,
      pronouns: lender.pronouns,
    },
    owner: {
      id: owner.id,
      full_name: owner.full_name,
      user_name: owner.user_name,
      pronouns: owner.pronouns,
    },
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
    },
  })
  .from(borrow_requests).where(eq(borrow_requests.id,borrow_request_id))
  .innerJoin(items,eq(borrow_requests.item_id,items.id))
  .innerJoin(borrower,eq(borrow_requests.borrower_id,borrower.id))
  .innerJoin(lender,eq(borrow_requests.lender_id,lender.id))
  .innerJoin(owner,eq(items.owner_id,owner.id))
  
  const request_actions_results:Promise<RequestAction[]> = db
  .select()
  .from(request_actions).where(eq(request_actions.borrow_request_id,borrow_request_id));

  // const read_notifications = db.update(notifications).set({read:true}).where(and(eq(notifications.user_id,locals.user.id),eq(notifications.url,url.pathname)))
  // const results = await Promise.all([borrow_request_reusults,request_actions_results,read_notifications]);
  const results = await Promise.all([borrow_request_reusults,request_actions_results]);
  if(results[0].length==0){
    throw error(404);
  }
  if(locals.user.id!=results[0][0].lender.id && locals.user.id!=results[0][0].borrower.id && locals.user.id!=results[0][0].owner.id){
    throw error(401);
  }
  return {
    borrower:results[0][0].borrower,
    lender:results[0][0].lender,
    owner:results[0][0].owner,
    item:results[0][0].item,
    borrow_request:results[0][0].borrow_request,
    request_actions: results[1],
  };
}) satisfies PageServerLoad;

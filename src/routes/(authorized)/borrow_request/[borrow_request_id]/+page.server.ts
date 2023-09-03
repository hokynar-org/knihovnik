import { db } from '$lib/server/db/drizzle';
import { borrow_requests, request_actions, items, users, notifications } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { BorrowRequest, PublicItemSafe, PublicUserSafe, RequestAction } from '$lib/types';
import { alias } from 'drizzle-orm/pg-core';
import { error, redirect } from '@sveltejs/kit';
import { getFileUrl } from '$lib/server/bucket';
import { item_select } from '$lib/server/db/selects';
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
    item: item_select,
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

  const results = await Promise.all([borrow_request_reusults,request_actions_results]);
  if(results[0].length==0){
    throw error(404);
  }
  if(locals.user.id!=results[0][0].lender.id && locals.user.id!=results[0][0].borrower.id && locals.user.id!=results[0][0].owner.id){
    throw error(401);
  }
  const image_src = await getFileUrl(results[0][0].item.image_src);
  return {
    borrower:results[0][0].borrower,
    lender:results[0][0].lender,
    owner:results[0][0].owner,
    item: {
      name: results[0][0].item.name,
      description: results[0][0].item.description,
      id: results[0][0].item.id,
      owner_id: results[0][0].item.owner_id,
      image_src: image_src,
      offered: results[0][0].item.offered,
    },
    borrow_request:results[0][0].borrow_request,
    request_actions: results[1],
  };
}) satisfies PageServerLoad;
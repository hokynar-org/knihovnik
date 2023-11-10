import { db } from '$lib/server/db/drizzle';
import { borrow_requests, request_actions, items, users, notifications } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { BorrowRequest, PublicItemSafe, PublicUserSafe, RequestAction, RequestActionMessage } from '$lib/types';
import { alias } from 'drizzle-orm/pg-core';
import { error, redirect } from '@sveltejs/kit';
import { getFileUrl } from '$lib/server/bucket';
import {request_action_message_select, borrowers,lenders,owners,borrow_request_select, borrower_select, item_select, lender_select, owner_select } from '$lib/server/db/selects';

export const load = (async ({ locals,params, url}) => {
  if(!params.borrow_request_id){
    throw error(404);
  }
  const borrow_request_id=params.borrow_request_id

  const borrow_request_reusults:Promise<{
    borrower:PublicUserSafe,
    lender:PublicUserSafe,
    owner:PublicUserSafe,
    item:PublicItemSafe,
    borrow_request:BorrowRequest
  }[]>
   = db
  .select({
    borrower: borrower_select,
    lender: lender_select,
    owner: owner_select,
    item: item_select,
    borrow_request: borrow_request_select,
  })
  .from(borrow_requests).where(eq(borrow_requests.id,borrow_request_id))
  .innerJoin(items,eq(borrow_requests.item_id,items.id))
  .innerJoin(borrowers,eq(borrow_requests.borrower_id,borrowers.id))
  .innerJoin(lenders,eq(borrow_requests.lender_id,lenders.id))
  .innerJoin(owners,eq(items.owner_id,owners.id))
  
  const request_actions_results:Promise<RequestActionMessage[]> = db
  .select(request_action_message_select)
  .from(request_actions).where(eq(request_actions.borrow_request_id,borrow_request_id))
  .innerJoin(users,eq(users.id,request_actions.user_id))
  .orderBy(request_actions.timestamp)

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
      hasMainPic: results[0][0].item.hasMainPic,
      iconName: results[0][0].item.iconName,
      transfeType:results[0][0].item.transfeType,
    },
    borrow_request: results[0][0].borrow_request,
    request_actions: results[1],
  };
}) satisfies PageServerLoad;
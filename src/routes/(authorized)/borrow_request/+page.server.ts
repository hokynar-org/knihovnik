import { db } from '$lib/server/db/drizzle';
import { borrow_requests, request_actions, items, users, notifications } from '$lib/server/db/schema';
import { and, eq,or } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { BorrowRequest, PublicItemSafe, PublicUserSafe, RequestAction } from '$lib/types';
import { alias } from 'drizzle-orm/pg-core';
import { error, redirect } from '@sveltejs/kit';
import { borrow_request_select, borrower_select, borrowers, item_select, lender_select, lenders, owner_select, owners } from '$lib/server/db/selects';

export const load = (async ({ locals }) => {
  if(!locals.user){
    throw error(401)
  }
  const user_id = locals.user.id;

  const borrow_request_reusults:{
    borrower:PublicUserSafe,
    lender:PublicUserSafe,
    owner:PublicUserSafe,
    item:PublicItemSafe,
    borrow_request:BorrowRequest
  }[]
   = await db
  .select({
    borrower: borrower_select,
    lender: lender_select,
    owner: owner_select,
    item: item_select,
    borrow_request: borrow_request_select,
  })
  .from(borrow_requests).orderBy(borrow_requests.timestamp).where(or(eq(borrow_requests.lender_id,user_id),eq(borrow_requests.borrower_id,user_id)))
  .innerJoin(items,eq(borrow_requests.item_id,items.id))
  .innerJoin(borrowers,eq(borrow_requests.borrower_id,borrowers.id))
  .innerJoin(lenders,eq(borrow_requests.lender_id,lenders.id))
  .innerJoin(owners,eq(items.owner_id,owners.id))

  return {
    borrow_requests:borrow_request_reusults
  };
}) satisfies PageServerLoad;
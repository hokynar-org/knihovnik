import { db } from '$lib/server/db/drizzle';
import { borrow_requests, request_actions, items, users, notifications } from '$lib/server/db/schema';
import { and, eq,or } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { BorrowRequest, PublicItemSafe, PublicUserSafe, RequestAction } from '$lib/types';
import { alias } from 'drizzle-orm/pg-core';
import { error, redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
  if(!locals.user){
    throw error(401)
  }
  const user_id = locals.user.id;
  const borrower = alias(users, "borrower");
  const lender = alias(users, "lender");
  const owner = alias(users, "owner");

  const borrow_request_reusults:{
    borrower:PublicUserSafe,
    lender:PublicUserSafe,
    owner:PublicUserSafe,
    item:PublicItemSafe,
    borrow_request:BorrowRequest
  }[]
   = await db
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
      image_src:items.image_src,
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
  .from(borrow_requests).where(or(eq(borrow_requests.lender_id,user_id),eq(borrow_requests.borrower_id,user_id)))
  .innerJoin(items,eq(borrow_requests.item_id,items.id))
  .innerJoin(borrower,eq(borrow_requests.borrower_id,borrower.id))
  .innerJoin(lender,eq(borrow_requests.lender_id,lender.id))
  .innerJoin(owner,eq(items.owner_id,owner.id))

  return {
    borrow_requests:borrow_request_reusults
  };
}) satisfies PageServerLoad;
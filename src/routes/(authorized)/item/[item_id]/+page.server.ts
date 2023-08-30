import { error, redirect } from '@sveltejs/kit';
import { borrow_requests, items, users } from '$lib/server/db/schema';
import { db } from '$lib/server/db/drizzle';
import { and, eq, or } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { BorrowRequest, Offer, PublicItemSafe,PublicUserSafe } from '$lib/types';
import { alias } from 'drizzle-orm/pg-core';

export const load: PageServerLoad = (async ({ locals, params }) => {
  const item_id = params.item_id;
  if(!locals.user){
    redirect(301,"/")
  }
  const user=locals.user;
  const result = await db
    .select({
      user: {
        id: users.id,
        full_name: users.full_name,
        user_name: users.user_name,
        pronouns: users.pronouns,
      },
      item: {
        name: items.name,
        description: items.description,
        id: items.id,
        owner_id: items.owner_id,
        holder_id: items.holder_id,
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
    .from(items)
    .where(eq(items.id, Number(item_id)))
    .innerJoin(users, eq(items.owner_id, users.id))
    .leftJoin(borrow_requests,
      and(
        eq(items.id, borrow_requests.item_id),
        or(
          eq(borrow_requests.lender_id,user.id),
          eq(borrow_requests.borrower_id,user.id)
        )
      )
    );

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
  .from(borrow_requests).where(and(eq(borrow_requests.item_id,Number(item_id)),or(eq(borrow_requests.lender_id,user_id),eq(borrow_requests.borrower_id,user_id))))
  .innerJoin(items,eq(borrow_requests.item_id,items.id))
  .innerJoin(borrower,eq(borrow_requests.borrower_id,borrower.id))
  .innerJoin(lender,eq(borrow_requests.lender_id,lender.id))
  .innerJoin(owner,eq(items.owner_id,owner.id))
  
  if (result.length == 0) {
    throw error(404);
  }

  const offer: Offer = result[0];

  return { offer: offer, borrow_requests: borrow_request_reusults};
}) satisfies PageServerLoad;

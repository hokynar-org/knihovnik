import { db } from '$lib/server/db/drizzle';
import { borrow_requests, items, users } from '$lib/server/db/schema';
import { and, eq,not } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { Offer } from '$lib/types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
  if (!locals.user){
    throw redirect(301,'/login')
  }
  const user_id = locals.user.id
  const offers:Offer[] = await db
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
    .from(items).where(and(not(eq(items.holder_id,items.owner_id)),eq(items.holder_id,user_id)))
    .innerJoin(users, eq(items.owner_id, users.id))
    .leftJoin(
      borrow_requests,
      and(
        eq(items.id, borrow_requests.item_id),
      ),
    );

  return {
    offers: offers,
  };
}) satisfies PageServerLoad;

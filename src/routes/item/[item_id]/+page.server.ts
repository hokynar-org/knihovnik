import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { borrow_requests, items, users } from '$lib/server/db/schema';
import { db } from '$lib/server/db/drizzle';
import { and, eq } from 'drizzle-orm';
import type { Offer } from '$lib/types';

export const load: PageServerLoad = (async ({ locals, params }) => {
  if (!locals.user || !params.item_id) {
    throw redirect(302, '/');
  }
  const item_id = params.item_id;
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
    .leftJoin(
      borrow_requests,
      and(
        eq(borrow_requests.borrower_id, Number(locals.user.id)),
        eq(items.id, borrow_requests.item_id),
      ),
    );

  if (result.length == 0) {
    throw error(404);
  }

  const offer: Offer = result[0];

  return { offer: offer };
}) satisfies PageServerLoad;

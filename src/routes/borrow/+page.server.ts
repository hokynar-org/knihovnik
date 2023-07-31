import { fail, redirect, type Actions } from '@sveltejs/kit';
import { db } from '$lib/server/db/drizzle';
import { borrow_requests, items, users } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { BorrowRequest, PublicItemSafe, PublicUserSafe } from '$lib/types';

export const load = (async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, '/login');
  }
  const all_items = await db.select().from(items);
  const offers: Array<{user: PublicUserSafe; item: PublicItemSafe; borrow_request:BorrowRequest|undefined}> = [];
  const user=locals.user;
  for (let i = 0; i < all_items.length; i++) {
    const item = all_items[i];

    const found_users = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(item.owner_id)));
    if (found_users.length == 0) {
      continue;
    }
    const owner = found_users[0];

    const found_borrow_requests = await db.select()
      .from(borrow_requests)
      .where(and(
        eq(borrow_requests.borrower_id,Number(user.id)),
        eq(borrow_requests.item_id,Number(item.id))
      ))

    const borrow_request:BorrowRequest|undefined = found_borrow_requests.length>0?found_borrow_requests[0]:undefined

    const public_user_safe: PublicUserSafe = {
      user_name: String(owner.user_name),
      full_name: String(owner.full_name),
      pronouns: String(owner.pronouns),
      id: Number(owner.id),
    };

    const public_item_safe: PublicItemSafe = {
      name: String(item.name),
      description: String(item.description),
      id: Number(item.id),
      user_id: Number(user.id),
    };

    offers[i] = { user: public_user_safe, item: public_item_safe, borrow_request:borrow_request};
  }
  return {
    offers: offers,
  };
}) satisfies PageServerLoad;


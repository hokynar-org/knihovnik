import { fail, redirect, type Actions } from '@sveltejs/kit';
import { db } from '$lib/server/db/drizzle';
import { borrow_requests, items, users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { PublicItemSafe, PublicUserSafe } from '$lib/types';

export const load = (async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, '/login');
  }
  const all_items = await db.select().from(items);
  const offers: Array<{ user: PublicUserSafe; item: PublicItemSafe }> = [];

  for (let i = 0; i < all_items.length; i++) {
    const item = all_items[i];

    const found_users = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(item.owner_id)));

    if (found_users.length == 0) {
      continue;
    }
    const user = found_users[0];

    const public_user_safe: PublicUserSafe = {
      user_name: String(user.user_name),
      full_name: String(user.full_name),
      pronouns: String(user.pronouns),
      id: Number(user.id),
    };

    const public_item_safe: PublicItemSafe = {
      name: String(item.name),
      description: String(item.description),
      id: Number(item.id),
      user_id: Number(user.id),
    };

    offers[i] = { user: public_user_safe, item: public_item_safe };
  }
  return {
    offers: offers,
  };
}) satisfies PageServerLoad;


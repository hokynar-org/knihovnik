import { redirect, type Actions, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db/drizzle';
import { borrow_requests, items } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import type { UserOffer } from '$lib/types';
import { getMyItems } from '$lib/server/item_load';

export const load = (async ({ locals }) => {
  if (!locals.user) {
    throw redirect(301, '/login');
  }
  const user = locals.user;
  const offers = await getMyItems(user.id);
  return {
    user_items: offers as UserOffer[],
  };
}) satisfies PageServerLoad;

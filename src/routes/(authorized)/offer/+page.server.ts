import { redirect, type Actions, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db/drizzle';
import { borrow_requests, items } from '$lib/server/db/schema';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import type { UserOffer } from '$lib/types';
import { getMyItems } from '$lib/server/item_load';
import { limit } from '$lib/components/ItemDisplay/CardConstants';

let defaultLimit = limit;

export const load = (async ({ locals, url }) => {
  if (!locals.user) {
    throw redirect(301, '/login');
  }
  const user = locals.user;
  const limit = Number(url.searchParams.get('limit'))
    ? Number(url.searchParams.get('limit'))
    : defaultLimit;
  const offset = Number(url.searchParams.get('offset'))
    ? Number(url.searchParams.get('offset'))
    : 0;
  const search = url.searchParams.get('search')
    ? url.searchParams.get('search')
    : null;

  const { offers, length } = await getMyItems(user.id, offset, limit, search);
  return {
    user_items: offers as UserOffer[],
    length: length,
    limit: limit,
    offset: offset,
    search: search,
  };
}) satisfies PageServerLoad;

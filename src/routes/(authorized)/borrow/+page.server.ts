import { db } from '$lib/server/db/drizzle';
import { borrow_requests, items, users } from '$lib/server/db/schema';
import { and, eq, not, or } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { Offer } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import { getFileUrl } from '$lib/server/bucket';
import { getItems } from '$lib/server/item_load';

export const load = (async ({ locals, url }) => {
  if (!locals.user) {
    redirect(301, '/');
  }
  const limit = Number(url.searchParams.get('limit'))?Number(url.searchParams.get('limit')):4
  const offset = Number(url.searchParams.get('offset'))?Number(url.searchParams.get('offset')):0
  const user = locals.user;
  const offers = await getItems(user.id, offset, limit);
  return {
    offers: offers as Offer[],
    offset: offset
  };
}) satisfies PageServerLoad;

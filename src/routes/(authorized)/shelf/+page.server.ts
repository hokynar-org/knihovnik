import { db } from '$lib/server/db/drizzle';
import { borrow_requests, items, users } from '$lib/server/db/schema';
import { and, eq, not, or } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { Offer } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import { getFileUrl } from '$lib/server/bucket';
import { getShelfItems } from '$lib/server/item_load';
import { limit } from '$lib/components/ItemDisplay/CardConstants';

let defaultLimit = limit;

export const load = (async ({ locals, url }) => {
  if (!locals.user) {
    redirect(301, '/');
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
  const { offers, length } = await getShelfItems(
    user.id,
    offset,
    limit,
    search,
  );
  return {
    offers: offers as Offer[],
    limit: limit,
    offset: offset,
    length: length,
    search: search,
  };
}) satisfies PageServerLoad;

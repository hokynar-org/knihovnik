import { db } from '$lib/server/db/drizzle';
import { borrow_requests, items, users } from '$lib/server/db/schema';
import { and, eq, not, or } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { Offer } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import { getFileUrl } from '$lib/server/bucket';
import { getItems } from '$lib/server/item_load';

export const load = (async ({ locals, url,setHeaders }) => {
  const defLimit = 4
  const defOffset = 0
  if (!locals.user) {
    throw redirect(301, '/login');
  }
  // if (!url.searchParams.get('limit') || !url.searchParams.get('offset')){
  //   throw redirect(301  , '/borrow?offset='+defOffset+'&limit='+defLimit);
  // }
  const limit = Number(url.searchParams.get('limit'))?Number(url.searchParams.get('limit')):4
  const offset = Number(url.searchParams.get('offset'))?Number(url.searchParams.get('offset')):0
  const user = locals.user;
  const {offers, length} = await getItems(user.id, offset, limit);
  // setHeaders({'cache-control': 'max-age=60'})
  return {
    offers: offers as Offer[],
    length: length,
    limit: limit,
    offset: offset
  };
}) satisfies PageServerLoad;

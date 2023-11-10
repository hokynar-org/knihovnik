import { db } from '$lib/server/db/drizzle';
import { borrow_requests, items, user_community_relations, users } from '$lib/server/db/schema';
import { and, eq, not, or } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { Offer } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import { getFileUrl } from '$lib/server/bucket';
import { getItems } from '$lib/server/item_load';
import { limit } from '$lib/components/ItemDisplay/CardConstants';

let defaultLimit = limit;

export const load = (async ({ locals, url, setHeaders }) => {
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
  let noCommunities=false;
  const { offers, length } = await getItems(user.id, offset, limit, search);
  if(offers.length==0){
    const communities = await db.select().from(user_community_relations).where(eq(user_community_relations.user_id,user.id))
    if(communities.length==0){
      noCommunities = true;
    }
  }
  return {
    offers: offers as Offer[],
    length: length,
    limit: limit,
    offset: offset,
    search: search,
    noCommunities: noCommunities,
  };
}) satisfies PageServerLoad;

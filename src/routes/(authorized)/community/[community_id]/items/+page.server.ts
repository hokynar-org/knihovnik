import { db } from '$lib/server/db/drizzle';
import {
  communities,
  community_messages,
  items,
  user_community_relations,
  users,
} from '$lib/server/db/schema';
import { and, eq, not, or } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { CommunityMessage, CommunityUserSafe } from '$lib/types';
import { error, redirect } from '@sveltejs/kit';
import { getCommunityItems, getShelfItems } from '$lib/server/item_load';
import { limit } from '$lib/components/ItemDisplay/CardConstants';

let defaultLimit = limit;

export const load = (async ({ locals, params, url, parent }) => {
  if (!locals.user) {
    throw redirect(301, '/login');
  }
  if (!params.community_id) {
    throw error(400);
  }
  const data = await parent();
  if (!data.role || (data.role !== 'MEMBER' && data.role !== 'ADMIN')) {
    throw error(403);
  }
  const community_id = params.community_id;
  const limit = Number(url.searchParams.get('limit'))
    ? Number(url.searchParams.get('limit'))
    : defaultLimit;
  const offset = Number(url.searchParams.get('offset'))
    ? Number(url.searchParams.get('offset'))
    : 0;
  const search = url.searchParams.get('search')
    ? url.searchParams.get('search')
    : null;
  const { offers, length } = await getCommunityItems(
    community_id,
    offset,
    limit,
    search,
  );
  return {
    community_items: offers,
    length: length,
    limit: limit,
    offset: offset,
    search: search,
  };
}) satisfies PageServerLoad;

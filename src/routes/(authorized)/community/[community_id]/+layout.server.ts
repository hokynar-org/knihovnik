import { db } from '$lib/server/db/drizzle';
import {
  communities,
  community_messages,
  items,
  user_community_relations,
  users,
} from '$lib/server/db/schema';
import { and, eq, not, or } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';
import type { CommunityMessage, Offer } from '$lib/types';
import { error, redirect } from '@sveltejs/kit';
import { getCommunityItems, getShelfItems } from '$lib/server/item_load';
import { user_select } from '$lib/server/db/selects';

export const load = (async ({ locals, params, url }) => {
  if (!locals.user) {
    throw redirect(301, '/login');
  }
  const user = locals.user;
  if (!params.community_id) {
    throw error(400);
  }
  const community_id = Number(params.community_id);
  const found_communities = await db
    .select()
    .from(communities)
    .where(eq(communities.id, community_id));
  const community_users = await db
    .select({
      relation: {
        user_id: user_community_relations.user_id,
        community_id: user_community_relations.community_id,
        role: user_community_relations.role,
        timestamp: user_community_relations.timestamp,
      },
      user: user_select,
    })
    .from(user_community_relations)
    .where(eq(user_community_relations.community_id, community_id))
    .innerJoin(users, eq(users.id, user_community_relations.user_id));
  const user_relation = await db
    .select()
    .from(user_community_relations)
    .where(
      and(
        eq(user_community_relations.community_id, community_id),
        eq(user_community_relations.user_id, user.id),
      ),
    );
  const messages: CommunityMessage[] = await db
    .select({
      id: community_messages.id,
      user_id: community_messages.user_id,
      community_id: community_messages.user_id,
      message: community_messages.message,
      timestamp: community_messages.timestamp,
      user_name: users.user_name,
    })
    .from(community_messages)
    .where(eq(community_messages.community_id, community_id))
    .innerJoin(users, eq(users.id, community_messages.user_id));
  if (found_communities.length == 0) {
    throw error(404);
  }
  const community = found_communities[0];
  const limit = Number(url.searchParams.get('limit'))?Number(url.searchParams.get('limit')):4
  const offset = Number(url.searchParams.get('offset'))?Number(url.searchParams.get('offset')):0
  const search = url.searchParams.get('search')?url.searchParams.get('search'):null
  const {offers, length} = await getCommunityItems(community_id, offset, limit,search);
  return {
    community: community,
    community_users: community_users,
    community_messages: messages,
    role: user_relation.length == 0 ? null : user_relation[0].role,
    community_items: offers,
    length: length,
    limit: limit,
    offset: offset,
    search: search,
  };
}) satisfies LayoutServerLoad;

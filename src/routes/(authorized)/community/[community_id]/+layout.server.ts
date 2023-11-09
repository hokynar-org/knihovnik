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
import type { CommunityMessage, CommunityUserSafe } from '$lib/types';
import { error, redirect } from '@sveltejs/kit';
import { getCommunityItems, getShelfItems } from '$lib/server/item_load';
import { user_community_relation_select, community_select } from '$lib/server/db/selects';

export const load = (async ({ locals, params, url }) => {
  if (!locals.user) {
    throw redirect(301, '/login');
  }
  const user = locals.user;
  if (!params.community_id) {
    throw error(400);
  }
  const community_id = params.community_id;
  const results = await db
    .select({
      community:community_select,
      user_relation:user_community_relation_select,
    })
    .from(communities)
    .where(eq(communities.id, community_id))
    .leftJoin(user_community_relations,
      and(
      eq(communities.id,user_community_relations.community_id),
      eq(user_community_relations.user_id, user.id),
    ),)
  if (results.length == 0) {
    throw error(404);
  }
  const {community,user_relation}=results[0];
  if (!community.visibility && !user_relation){
    throw error(404);
  }
  return {
    community: community,
    role: user_relation?user_relation.role:null,
  };
}) satisfies LayoutServerLoad;

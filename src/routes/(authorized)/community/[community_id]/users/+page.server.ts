import { db } from '$lib/server/db/drizzle';
import {
  communities,
  community_messages,
  items,
  user_community_relations,
  users,
} from '$lib/server/db/schema';
import { and, eq, not, or, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { CommunityMessage, CommunityUserSafe } from '$lib/types';
import { error, redirect } from '@sveltejs/kit';
import { getCommunityItems, getShelfItems } from '$lib/server/item_load';
import { user_select } from '$lib/server/db/selects';

export const load = (async ({ locals, params, url, parent }) => {
  if (!locals.user) {
    throw redirect(301, '/login');
  }
  if (!params.community_id) {
    throw error(400);
  }
  const data = await parent();
  if(!data.role || (data.role!=='MEMBER' && data.role!=='ADMIN')){
    throw error(403);
  }
  const community_id = params.community_id;
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
    .innerJoin(users, eq(users.id, user_community_relations.user_id)).orderBy(sql`lower(${users.user_name})`)
  return {
    community_users:community_users
  };
}) satisfies PageServerLoad;

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
import { user_select } from '$lib/server/db/selects';

export const load = (async ({ locals, params, url, parent, }) => {
  if (!locals.user) {
    throw redirect(301, '/login');
  }
  if (!Number(params.community_id)) {
    throw error(400);
  }
  const data = await parent();
  if(!data.role || (data.role!=='MEMBER' && data.role!=='ADMIN')){
    throw error(403);
  }
  const community_id = Number(params.community_id);
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
  return {
    community_messages: messages,
  };
}) satisfies PageServerLoad;

import { db } from '$lib/server/db/drizzle';
import { borrow_requests, communities, community_messages, items, user_community_relations, users } from '$lib/server/db/schema';
import { and, eq,not, or } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { Offer } from '$lib/types';
import { error, redirect } from '@sveltejs/kit';
import {getFileUrl} from '$lib/server/bucket'
import {getShelfItems } from '$lib/server/item_load';
import { user_select } from '$lib/server/db/selects';

export const load = (async ({ locals,params }) => {
  if(!locals.user){
    throw redirect(301,"/login")
  }
  const user=locals.user;
  if(!params.community_id){
    throw error(400);
  }
  const community_id=Number(params.community_id)
  const found_communities =await db.select().from(communities).where(eq(communities.id,community_id));
  const community_users =await db.select({
    relation:{
      user_id:      user_community_relations.user_id,
      community_id: user_community_relations.community_id,
      role:         user_community_relations.role,
    },
    user:user_select,
  }).from(user_community_relations)
  .where(eq(user_community_relations.community_id,community_id))
  .innerJoin(users,eq(users.id,user_community_relations.user_id))
  const user_relation = await db.select().from(user_community_relations).where(and(eq(user_community_relations.community_id,community_id),eq(user_community_relations.user_id,user.id)));
  const messages = await db.select().from(community_messages).where(eq(community_messages.community_id,community_id));
  if(found_communities.length==0){
    throw error(404);
  }
  const community=found_communities[0];
  return {
    community:          community,
    community_users:    community_users,
    community_messages: messages,
    role: user_relation.length==0?null:user_relation[0].role
  };
}) satisfies PageServerLoad;

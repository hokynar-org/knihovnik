import { db } from '$lib/server/db/drizzle';
import { communities, user_community_relations, users } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { error, redirect, type Actions, fail } from '@sveltejs/kit';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
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
  const user_relations = await db.select().from(user_community_relations).where(and(eq(user_community_relations.community_id,community_id),eq(user_community_relations.user_id,user.id)));
  if(user_relations.length==0){
    throw error(401);
  }
  const user_relation=user_relations[0];
  if(user_relation.role!='ADMIN'){
    throw error(403);
  }
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
  return {
    community_users:community_users
  };
}) satisfies PageServerLoad;

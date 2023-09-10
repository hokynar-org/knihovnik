import { db } from '$lib/server/db/drizzle';
import { user_community_relations } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

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
    throw error(401);
  }

}) satisfies PageServerLoad;

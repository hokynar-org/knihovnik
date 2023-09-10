import { db } from '$lib/server/db/drizzle';
import { borrow_requests, communities, community_messages, items, user_community_relations, users } from '$lib/server/db/schema';
import { and, eq,not, or } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { CommunityMessage, Offer } from '$lib/types';
import { error, redirect } from '@sveltejs/kit';
import {getFileUrl} from '$lib/server/bucket'
import {getCommunityItems, getShelfItems } from '$lib/server/item_load';
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


}) satisfies PageServerLoad;

import { redirect, type Actions, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db/drizzle';
import { borrow_requests, communities, items, user_community_relations } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import type { Item, PublicItemSafe } from '$lib/types';
import { getMyItems } from '$lib/server/item_load';


export const load = (async ({ locals }) => {
  if(!locals.user){
    throw redirect(301,"/login")
  }
  const user = locals.user
  const user_communities = await db.select().from(communities).innerJoin(user_community_relations,and(eq(communities.id,user_community_relations.community_id),eq(user_community_relations.user_id,user.id)))
  return {
    user_communities: user_communities,
  };
}) satisfies PageServerLoad;
import { db } from '$lib/server/db/drizzle';
import { borrow_requests, communities, items, users } from '$lib/server/db/schema';
import { and, eq,not, or } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { Offer } from '$lib/types';
import { error, redirect } from '@sveltejs/kit';
import {getFileUrl} from '$lib/server/bucket'
import {getShelfItems } from '$lib/server/item_load';

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
  if(found_communities.length==0){
    throw error(404);
  }
  const community=found_communities[0];
  return {
    community: community,
  };
}) satisfies PageServerLoad;

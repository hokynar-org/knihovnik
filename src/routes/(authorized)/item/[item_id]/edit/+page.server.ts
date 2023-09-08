import { db } from '$lib/server/db/drizzle';
import { borrow_requests, communities, community_messages, items, user_community_relations, users } from '$lib/server/db/schema';
import { and, eq,not, or } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { CommunityMessagePlus, Offer } from '$lib/types';
import { error, redirect } from '@sveltejs/kit';
import {getFileUrl} from '$lib/server/bucket'
import {getCommunityItems, getShelfItems } from '$lib/server/item_load';
import { user_select } from '$lib/server/db/selects';

export const load = (async ({ locals,params,parent,   }) => {
  if(!locals.user){
    throw redirect(301,"/login")
  }
  const user = locals.user;
  const data= (await parent());
  const owner = data.owner;
  const holder = data.holder;
  if(user.id != owner.id){
    throw error(401);
  }
  if(!holder || holder.id != owner.id){
    throw error(400);
  }

}) satisfies PageServerLoad;

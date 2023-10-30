import { redirect, type Actions, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db/drizzle';
import { borrow_requests, communities, item_visibility, items, user_community_relations } from '$lib/server/db/schema';
import { and, eq, ilike, or, sql } from 'drizzle-orm';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import type { Item, PublicItemSafe } from '$lib/types';
import { getMyItems, getShelfItems } from '$lib/server/item_load';
import { alias } from 'drizzle-orm/pg-core';

export const load = (async ({ locals, url }) => {
  if(!locals.user){
    throw redirect(301,"/login")
  }
  const user= locals.user;
  const limit = Number(url.searchParams.get('limit'))?Number(url.searchParams.get('limit')):8
  const offset = Number(url.searchParams.get('offset'))?Number(url.searchParams.get('offset')):0
  const search = url.searchParams.get('search')?url.searchParams.get('search'):null;
  const q = search?or(ilike(communities.name,'%'+search+'%'),ilike(communities.description,'%'+search+'%')):undefined;
  const count_users = alias(user_community_relations,"count_users")
  const db_result = await db.select({
    id: communities.id,
    description: communities.description,
    name: communities.name,
    visibility: communities.visibility,
    role: user_community_relations.role,
    userCount: sql<number>`count(distinct ${count_users.user_id})`,
    itemCount: sql<number>`count(distinct ${items.id})`
    })
    .from(communities).where(and(q,eq(communities.visibility,true)))
    .leftJoin(user_community_relations,
      and(
        eq(communities.id,user_community_relations.community_id),
        eq(user_community_relations.user_id,user.id)
        )
      )
    .leftJoin(count_users,eq(count_users.community_id,communities.id))
    .leftJoin(item_visibility, eq(item_visibility.community_id,count_users.community_id))
    .leftJoin(items, and(eq(items.id, item_visibility.item_id),eq(items.offered,true),eq(items.holder_id,items.owner_id)))
    .groupBy(communities.id,communities.name, communities.description, communities.visibility, user_community_relations.role,count_users.community_id )
      
  const length = db_result.length
  const result = db_result.slice((offset>=0)?offset:0,((offset>=0)?offset:0)+((limit>0)?limit:8))
  return {
    communities: result,
    limit: limit,
    offset: offset,
    length:length,
    search:search,
  };
}) satisfies PageServerLoad;

import { redirect, type Actions, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db/drizzle';
import { borrow_requests, communities, item_visibility, items, user_community_relations, users } from '$lib/server/db/schema';
import { and, asc, eq, or, sql } from 'drizzle-orm';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import type { Item, PublicItemSafe } from '$lib/types';
import { getMyItems } from '$lib/server/item_load';
import { community_select, user_community_relation_select } from '$lib/server/db/selects';
import { alias } from 'drizzle-orm/pg-core';


export const load = (async ({ locals }) => {
  if(!locals.user){
    throw redirect(301,"/login")
  }
  const user = locals.user
  const count_users = alias(user_community_relations,"count_users")
  const user_communities = await db.select({
      id: communities.id,
      description: communities.description,
      name: communities.name,
      visibility: communities.visibility,
      role: user_community_relations.role,
      userCount: sql<number>`count(distinct ${count_users.user_id})`,
      itemCount: sql<number>`count(distinct ${items.id})`
    })
    .from(communities)
    .innerJoin(
      user_community_relations,
      and(
        eq(communities.id,user_community_relations.community_id),
        eq(user_community_relations.user_id,user.id)
      )
    )
    .leftJoin(count_users,and(eq(count_users.community_id,communities.id),or(eq(count_users.role, 'MEMBER'), eq(count_users.role, 'ADMIN'))))
    .leftJoin(item_visibility, eq(item_visibility.community_id,count_users.community_id))
    .leftJoin(items, and(eq(items.id, item_visibility.item_id),eq(items.offered,true),eq(items.holder_id,items.owner_id)))
    .groupBy(communities.id,communities.name, communities.description, communities.visibility, user_community_relations.role,count_users.community_id )
    return {
    user_communities: user_communities,
  };
}) satisfies PageServerLoad;
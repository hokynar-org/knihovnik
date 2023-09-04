import { db } from '$lib/server/db/drizzle';
import { borrow_requests, communities, items, notifications, request_actions, user_community_relations, users } from '$lib/server/db/schema';
import { and, eq,not } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { Offer } from '$lib/types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
  await db.delete(user_community_relations);
  await db.delete(communities);

  return {};
}) satisfies PageServerLoad;

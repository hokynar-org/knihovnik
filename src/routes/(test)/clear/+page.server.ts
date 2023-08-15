import { db } from '$lib/server/db/drizzle';
import { borrow_requests, items, request_actions, users } from '$lib/server/db/schema';
import { and, eq,not } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { Offer } from '$lib/types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
  await db.delete(request_actions);
  await db.delete(borrow_requests);
  await db.delete(items);

  return {};
}) satisfies PageServerLoad;

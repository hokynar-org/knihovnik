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
}) satisfies PageServerLoad;

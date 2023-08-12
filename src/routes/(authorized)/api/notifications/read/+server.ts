import { error, fail, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/drizzle';
import {borrow_requests, items, notifications, request_actions} from '$lib/server/db/schema'
import { and, eq } from 'drizzle-orm';
import type { Notification, RequestAction } from '$lib/types';

export const POST = (async ({ request, params, locals, url, route }) => {
  if (!locals.user) {
    throw error(401);
  }
  const user_id = locals.user.id;
  const read_notifications:Notification[] = await db.update(notifications).set({read:true}).where(eq(notifications.user_id,user_id)).returning();
  if(read_notifications.length == 0) {
    throw error(400);
  }
  return json({notification:read_notifications});
}) satisfies RequestHandler;
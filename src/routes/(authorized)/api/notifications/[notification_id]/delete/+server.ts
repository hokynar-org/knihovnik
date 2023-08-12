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
  if(!params.notification_id) {
    throw error(400);
  }
  const user_id = locals.user.id;
  const notification_id = Number(params.notification_id)
  const deleted_notifications:Notification[] = await db.delete(notifications).where(and(eq(notifications.user_id,user_id),eq(notifications.id,notification_id))).returning();
  if(deleted_notifications.length == 0) {
    throw error(400);
  }
  return json({notification:deleted_notifications[0]});
}) satisfies RequestHandler;
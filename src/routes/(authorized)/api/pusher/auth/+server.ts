import { error, fail, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/drizzle';
import {borrow_requests, items, notifications, request_actions} from '$lib/server/db/schema'
import { and, eq } from 'drizzle-orm';
import type { Notification, RequestAction } from '$lib/types';
import { pusher } from '$lib/server/pusher'

export const POST = (async ({ request, params, locals, url, route }) => {
  if (!locals.user) {
    throw error(401);
  }
  const user_id = locals.user.id;
  const pusher_user = {
    id: String(user_id),
  };
  const body = await (await request).text()
  const socketId = body.split('=')[1]
  const authResponse = pusher.authenticateUser(socketId, pusher_user);
  return json(authResponse);
}) satisfies RequestHandler;
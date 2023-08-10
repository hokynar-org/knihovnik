import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type {Notification} from '$lib/types' 
import { db } from '$lib/server/db/drizzle';
import { notifications} from '$lib/server/db/schema';
import {eq} from 'drizzle-orm'

export const load = (async ({ locals }) => {
  if (!locals.user) throw redirect(303, '/login');
  const user_notifications:Array<Notification> = await db.select().from(notifications).where(eq(notifications.user_id,locals.user.id));
  return {
    user: locals.user,
    notifications: user_notifications,
  };
}) satisfies LayoutServerLoad;

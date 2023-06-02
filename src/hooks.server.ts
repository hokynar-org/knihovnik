import type { Handle } from '@sveltejs/kit'
import { db } from '$lib/server/db/drizzle'
import { users } from '$lib/server/db/schema'
import { eq } from 'drizzle-orm'

export const handle: Handle = async ({ event, resolve }) => {
  const session = event.cookies.get('session')
  if (!session) {
    return await resolve(event)
  }

  const found_users = await db.select().from(users).where(eq(users.auth_token, session));
  const user = found_users[0];

  if (user) {
    event.locals.user = {
        user_name: String(user.user_name),
    }
  }
  return await resolve(event)
}

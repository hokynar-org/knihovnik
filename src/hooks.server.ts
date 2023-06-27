import type { Handle } from "@sveltejs/kit";
import { db } from "$lib/server/db/drizzle";
import { sessions, users } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export const handle: Handle = async ({ event, resolve }) => {
  const user_session = event.cookies.get("session");
  if (!user_session) {
    return await resolve(event);
  }

  const db_sessions = await db
    .select()
    .from(sessions)
    .where(eq(sessions.auth_token, String(user_session)));

  if (db_sessions.length == 0) {
    event.cookies.delete("session");
    return await resolve(event);
  }

  const found_users = await db
    .select()
    .from(users)
    .where(eq(users.id, Number(db_sessions[0].user_id)));

  if (found_users.length == 0) {
    return await resolve(event);
  }

  const user = found_users[0];
  const { password_hash: password_hash, ...user_safe } = user;
  if (user) {
    event.locals.user = user_safe;
  }
  return await resolve(event);
};

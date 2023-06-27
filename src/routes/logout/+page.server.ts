import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/db/drizzle";
import { sessions, users } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export const load = (async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, "/login");
  }
}) satisfies PageServerLoad;

export const actions: Actions = {
  logout: async ({ cookies, locals }) => {
    if (!locals.user) {
      throw redirect(302, "/login");
    }
    const user_session = cookies.get("session");
    await db
      .delete(sessions)
      .where(eq(sessions.auth_token, String(user_session)));
    cookies.set("session", "", {
      path: "/",
      expires: new Date(0),
    });

    throw redirect(302, "/");
  },
};

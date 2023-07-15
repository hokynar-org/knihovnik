import { eq } from "drizzle-orm";
import { sessions } from "$lib/server/db/schema";
import { db } from "$lib/server/db/drizzle";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async ({ locals, parent }) => {
  await parent();
  if (!locals.user) {
    throw redirect(302, "/login");
  } else {
    if (locals.user.role != "ADMIN") {
      console.log(locals.user.role);
      throw redirect(302, "/");
    }
  }
  const all_sessions = await db.select().from(sessions);
  return {
    sessions: all_sessions,
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  delete_session: async ({ url, locals }) => {
    if (!locals.user) {
      throw redirect(303, "/login");
    } else {
      if (locals.user.role != "ADMIN") {
        throw redirect(303, "/");
      }
    }

    const auth_token = url.searchParams.get("auth_token");
    if (!auth_token) {
      return fail(400, { message: "Invalid request" });
    }

    try {
      await db
        .delete(sessions)
        .where(eq(sessions.auth_token, String(auth_token)));
    } catch (err) {
      return fail(500, {
        message: "Database Error",
      });
    }
    throw redirect(303, "/admin/sessions");
  },
};

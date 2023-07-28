import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

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

    cookies.delete("session_jwt");

    throw redirect(302, "/");
  },
};

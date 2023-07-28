import { db } from "$lib/server/db/drizzle";
import { borrow_asks } from "$lib/server/db/schema";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
  return {
    theme: cookies.get("theme"),
    user: locals.user,
  };
};

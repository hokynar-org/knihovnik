import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
  return {
    theme: cookies.get("theme"),
    user: locals.user,
  };
};

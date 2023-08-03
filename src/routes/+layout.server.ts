import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, cookies }) => {
  const darkMode = cookies.get('dark');

  return {
    darkMode: darkMode === 'true' ? true : darkMode === 'false' ? false : null,
    user: locals.user,
  };
}) satisfies LayoutServerLoad;

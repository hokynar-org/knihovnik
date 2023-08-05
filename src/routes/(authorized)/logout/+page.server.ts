import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  logout: async ({ cookies }) => {
    cookies.delete('session_jwt');
    throw redirect(302, '/login');
  },
};

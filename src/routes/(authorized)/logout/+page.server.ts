import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
  cookies.delete('session_jwt');
  throw redirect(302, '/login');
}) satisfies PageServerLoad;

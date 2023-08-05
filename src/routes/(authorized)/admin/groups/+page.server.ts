import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
  if (locals.user?.role !== 'ADMIN') {
    throw redirect(302, '/');
  }
}) satisfies PageServerLoad;

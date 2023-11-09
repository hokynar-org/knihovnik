import { eq, or } from 'drizzle-orm';
import { borrow_requests, items, users } from '$lib/server/db/schema';
import { db } from '$lib/server/db/drizzle';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
  return {
    users: db.select().from(users),
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  delete_user: async ({ url, locals }) => {
    if (locals.user?.role !== 'ADMIN') {
      throw redirect(303, '/');
    }

    const id = url.searchParams.get('id');
    if (!id) {
      return fail(400, { message: 'Invalid request' });
    }

    try {
      await db
        .delete(borrow_requests)
        .where(
          or(
            eq(borrow_requests.lender_id, id),
            eq(borrow_requests.borrower_id, id),
          ),
        );
      await db.delete(items).where(eq(items.owner_id, id));
      await db.delete(users).where(eq(users.id, id));
    } catch (err) {
      console.error(err);
      return fail(500, {
        message: 'Database Error',
      });
    }
    throw redirect(303, '/admin/users');
  },

  change_user_role: async ({ url, locals }) => {
    if (locals.user?.role !== 'ADMIN') {
      throw redirect(303, '/');
    }

    const id = url.searchParams.get('id');
    const role = url.searchParams.get('role');
    if (!id || !role) {
      return fail(400, { message: 'Invalid request' });
    }
    try {
      if (role == 'ADMIN' || role == 'USER') {
        await db
          .update(users)
          .set({ role: role })
          .where(eq(users.id, id));
      } else {
        return fail(400, { message: 'Invalid request' });
      }
    } catch (err) {
      console.error(err);
      return fail(500, {
        message: 'Database Error',
      });
    }
    throw redirect(303, '/admin/users');
  },
};

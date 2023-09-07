import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import { borrow_requests, items, users } from '$lib/server/db/schema';
import { db } from '$lib/server/db/drizzle';
import { eq } from 'drizzle-orm';
import { JWT_SECRET } from '$env/static/private';
import jwt from 'jsonwebtoken';
import type { PageServerLoad, Actions } from './$types.js';
import type { Session } from '$lib/types.js';
import { notifications } from '$lib/store.js';

const schema = z.object({
  user_name: z.string().min(2),
  full_name: z.string().min(1),
  pronouns: z.string(),
});

const schemaPassword = z.object({
  old_password: z.string().min(4),
  new_password: z.string().min(4),
});

export const load = (async ({ locals }) => {
  const select_type = {
    user: {
      id: users.id,
      full_name: users.full_name,
      user_name: users.user_name,
      pronouns: users.pronouns,
    },
    item: {
      name: items.name,
      description: items.description,
      id: items.id,
      owner_id: items.owner_id,
    },
    borrow_request: {
      status: borrow_requests.status,
      id: borrow_requests.id,
      borrower_id: borrow_requests.borrower_id,
      lender_id: borrow_requests.lender_id,
      item_id: borrow_requests.item_id,
      timestamp: borrow_requests.timestamp,
    },
  };

  const form = await superValidate(schema);
  const formPassword = await superValidate(schemaPassword);

  return {
    form: form,
    form_password: formPassword,
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  update: async ({ request, cookies, locals }) => {
    if (!locals.user) {
      throw redirect(303, '/login');
    }

    const form = await superValidate(request, schema);

    if (!form.valid) {
      return fail(400, { form });
    }

    await db
      .update(users)
      .set({
        user_name: form.data.user_name,
        full_name: form.data.full_name,
        pronouns: form.data.pronouns,
      })
      .where(eq(users.id, Number(locals.user.id)));

    const session = jwt.verify(
      cookies.get('session_jwt')!,
      JWT_SECRET,
    ) as Session;

    const user_safe = session.user_safe;

    const new_session: Session = {
      session_stay: session.session_stay,
      user_safe: {
        ...user_safe,
        user_name: form.data.user_name,
        full_name: form.data.full_name,
        pronouns: form.data.pronouns,
      },
    };

    cookies.set(
      'session_jwt',
      jwt.sign(new_session, JWT_SECRET, {
        expiresIn: session.session_stay ? '7 days' : '4 hours',
      }),
      {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      },
    );

    throw redirect(303, '/user');
  },

  update_password: async ({ request, locals }) => {
    if (!locals.user) {
      throw redirect(302, '/login');
    }

    const form = await superValidate(request, schemaPassword);

    if (!form.valid) {
      return fail(400, { form });
    }

    const found_users = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(locals.user.id)));

    if (found_users.length == 0) {
      throw redirect(303, '/login');
    }

    const old_password = form.data.old_password;
    const password_auth = await bcrypt.compare(
      old_password,
      String(found_users[0].password_hash),
    );
    if (!password_auth) {
      return fail(400, { form });
    }
    await db
      .update(users)
      .set({
        password_hash: await bcrypt.hash(form.data.new_password, 10),
      })
      .where(eq(users.id, Number(locals.user.id)));

    throw redirect(303, '/user');
  },
} satisfies Actions;

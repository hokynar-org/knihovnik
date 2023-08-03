import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { superValidate, message } from 'sveltekit-superforms/server';
import { type Actions, redirect } from '@sveltejs/kit';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db/drizzle';
import { JWT_SECRET } from '$env/static/private';
import type { PageServerLoad } from './$types';
import type { Session } from '$lib/types';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  stay: z.boolean(),
});

export const load: PageServerLoad = (async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, '/');
  }
  const form = await superValidate(schema);

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  login: async ({ cookies, request, locals }) => {
    if (locals.user) {
      throw redirect(303, '/');
    }

    const form = await superValidate(request, schema);

    if (!form.valid) {
      return message(form, 'Enter valid email and password', { status: 400 });
    }

    const email = form.data.email;
    const password = form.data.password;
    let found_users;
    try {
      found_users = await db.select().from(users).where(eq(users.email, email));
    } catch (error) {
      return message(form, 'Internal Error', { status: 500 });
    }
    if (found_users.length == 0) {
      return message(form, 'Invalid email or password', { status: 400 });
    }
    const user = found_users[0];
    const password_auth = await bcrypt.compare(
      password,
      String(user.password_hash),
    );

    if (!password_auth) {
      return message(form, 'Invalid email or password', { status: 400 });
    }

    const { password_hash: _pwdhash, ...user_safe } = user;

    const session: Session = {
      user_safe: user_safe,
      session_stay: form.data.stay,
      session_end:
        Date.now() +
        (form.data.stay ? 7 * 24 * 60 * 60 * 1000 : 4 * 60 * 60 * 1000),
    };

    const session_jwt = jwt.sign(session, JWT_SECRET);

    cookies.set('session_jwt', String(session_jwt), {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    throw redirect(303, '/');
  },
} satisfies Actions;

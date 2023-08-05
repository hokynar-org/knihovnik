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

export const load: PageServerLoad = (async () => {
  const form = await superValidate(schema);

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  login: async ({ cookies, request }) => {
    const form = await superValidate(request, schema);

    if (!form.valid) {
      return message(form, 'Enter valid email and password', { status: 400 });
    }

    const { email, password } = form.data;
    let user;

    try {
      const found_users = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (found_users.length == 0) {
        return message(form, 'Invalid email or password', { status: 400 });
      }

      user = found_users[0];
    } catch (error) {
      return message(form, 'Internal Error', { status: 500 });
    }

    const password_auth = await bcrypt.compare(
      password,
      String(user.password_hash),
    );

    if (!password_auth) {
      return message(form, 'Invalid email or password', { status: 400 });
    }

    if (user.confirm_hash) {
      throw redirect(303, '/register/success');
    }

    const {
      password_hash: _pwdhash,
      confirm_hash: _chash,
      ...user_safe
    } = user;

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

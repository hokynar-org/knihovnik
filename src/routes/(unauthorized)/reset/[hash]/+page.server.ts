/* eslint-disable camelcase */
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { message, superValidate } from 'sveltekit-superforms/server';
import { db } from '$lib/server/db/drizzle';
import { reset_tokens, users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error, type Actions, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { User } from '$lib/types';

const schema = z
  .object({
    hash: z.string(),
    password: z.string(),
    password2: z.string(),
  })
  .refine((t) => t.password === t.password2, "passwords don't match");

export const load = (async ({ params: { hash } }) => {
  const form = await superValidate(schema);

  const obj = await db
    .select()
    .from(reset_tokens)
    .where(eq(reset_tokens.hash, hash))
    .then((vals) => vals[0]);

  if (!obj || (obj.expires && obj.expires < new Date())) {
    throw error(404, 'Invalid or expired token');
  }

  return { form, hash };
}) satisfies PageServerLoad;

export const actions: Actions = {
  reset: async ({ request }) => {
    const form = await superValidate(request, schema);

    if (!form.valid) {
      return message(form, 'Enter a valid e-mail', { status: 400 });
    }

    const { hash, password } = form.data;
    let user: User;

    try {
      const token = await db
        .select()
        .from(reset_tokens)
        .where(eq(reset_tokens.hash, hash))
        .then((vals) => vals[0]);

      if (!token) {
        return message(form, 'Invalid token', { status: 400 });
      }

      const found_users = await db
        .select()
        .from(users)
        .where(eq(users.id, token.user_id));

      if (found_users.length == 0) {
        return message(form, 'Invalid token (internal error)', { status: 400 });
      }

      user = found_users[0];
    } catch (error) {
      return message(form, 'Internal Error', { status: 500 });
    }

    try {
      await db.transaction(async (trx) => {
        await trx
          .update(users)
          .set({ password_hash: await bcrypt.hash(password, 10) })
          .where(eq(users.id, user.id));

        await trx
          .update(reset_tokens)
          .set({ expires: new Date() })
          .where(eq(reset_tokens.hash, hash));
      });
    } catch (err) {
      return message(form, `Internal error, try again`, { status: 500 });
    }

    throw redirect(303, '/login');
  },
} satisfies Actions;

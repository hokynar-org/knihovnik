/* eslint-disable camelcase */
import { z } from 'zod';
import { message, superValidate } from 'sveltekit-superforms/server';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db/drizzle';
import { reset_tokens, users } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { sendPasswordResetEmail } from '$lib/server/mail';
import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
  email: z.string().email(),
});

export const load = (async () => {
  const form = await superValidate(schema);

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  reset: async ({ request }) => {
    const form = await superValidate(request, schema);

    if (!form.valid) {
      return message(form, 'Enter a valid e-mail', { status: 400 });
    }

    const { email } = form.data;
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

    const host = env['ORIGIN'] ?? 'https://knihovnik.vercel.app';
    const hash = crypto.randomUUID();

    try {
      await db.insert(reset_tokens).values([
        {
          hash,
          user_id: user.id,
          type: 'PASSWORD',
        },
      ]);

      await sendPasswordResetEmail(user.email, `${host}/reset/${hash}`);
    } catch (err) {
      await db.delete(reset_tokens).where(eq(reset_tokens.hash, hash));

      return message(form, `Internal error, try again`, { status: 500 });
    }

    throw redirect(303, '/login');
  },
} satisfies Actions;

import { z } from "zod";
import { superValidate } from "sveltekit-superforms/server";
import type { PageServerLoad, Actions } from "./$types.d.ts";
import { fail, redirect } from "@sveltejs/kit";
import { users } from '$lib/server/db/schema';
import {db} from '$lib/server/db/drizzle';
import {eq} from 'drizzle-orm';
import bcrypt from 'bcrypt';

const schema = z.object({
  user_name: z.string().min(2),
  full_name: z.string().min(1),
  pronouns: z.string(),
});

const schema_password = z.object({
  old_password: z.string().min(4),
  new_password: z.string().min(4),
});

export const load = (async ({locals, cookies}) => {
  if (!locals.user) {
    throw redirect(302, '/')
  }

  const form =          await superValidate(schema);
  const form_password = await superValidate(schema_password);

  return {form: form, form_password: form_password};
}) satisfies PageServerLoad;

export const actions:Actions = {
  update: async ({ request,cookies }) => {
    const form = await superValidate(request, schema);
    if (!form.valid) {
      return fail(400, { form });
    }
    const session = cookies.get('session');

    await db.update(users).set({
      user_name: form.data.user_name,
      full_name: form.data.full_name,
      pronouns: form.data.pronouns,
    }).where(eq(users.auth_token,String(session)));

    throw redirect(303, '/user');
  },
  update_password: async ({ request,cookies }) => {
    const form = await superValidate(request, schema_password);
    
    if (!form.valid) {
      return fail(400, { form });
    }
    const session = cookies.get('session');

    if(!session) {
      return fail(400, { form });
    }

    const found_users = await db.select().from(users).where(eq(users.auth_token, String(session)));

    if(found_users.length==0){
      return fail(400, { form });
    }
    const user=found_users[0];
    const old_password = form.data.old_password;
    const password_auth = await bcrypt.compare(old_password, String(user.password_hash));
    if(!password_auth){
      return fail(400, { form });
    }
    await db.update(users).set({
      password_hash: await bcrypt.hash(form.data.new_password, 10),
    }).where(eq(users.auth_token,String(session)));

    throw redirect(303, '/user');
  },
} satisfies Actions;

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
  password: z.string().min(4),
  pronouns: z.string(),
  email: z.string().email(),
});

export const load = (async () => {
  const form = await superValidate(schema);

  return { form };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, schema);
    // console.log("POST", form);

    if (!form.valid) {
      return fail(400, { form });
    }

    const user  = await db.select().from(users).where(eq(users.user_name, form.data.user_name));
    const email = await db.select().from(users).where(eq(users.email, form.data.email));

    if(user.length>0){
      return fail(400, {user_name_taken:true})
    }

    if(email.length>0){
      return fail(400, {email_taken:true})
    }

    await db.insert(users).values({
      user_name: form.data.user_name,
      full_name: form.data.full_name,
      email: form.data.email,
      pronouns: form.data.pronouns,
      password_hash: await bcrypt.hash(form.data.password, 10)
    });

    return redirect(303, '/');
  },
} satisfies Actions;

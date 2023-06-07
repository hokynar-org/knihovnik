import { z } from "zod";
import { superValidate } from "sveltekit-superforms/server";
import type { PageServerLoad, Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { users } from '$lib/server/db/schema';
import {db} from '$lib/server/db/drizzle';
import {eq} from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import {sendRegistrationEmail} from '$lib/server/mail.ts'
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "$env/static/private";

const schema = z.object({
  user_name: z.string().min(2),
  full_name: z.string().min(1),
  password: z.string().min(4),
  pronouns: z.string(),
  email: z.string().email()
});

export const load = (async ({locals}) => {
  if (locals.user) {
    throw redirect(302, '/')
  }

  const form = await superValidate(schema);
  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (locals.user) {
      throw redirect(303, '/')
    }
    const form = await superValidate(request, schema);

    if (!form.valid) {
      return fail(400, { form });
    }

    const user  = await db.select().from(users).where(eq(users.user_name, form.data.user_name));
    const email = await db.select().from(users).where(eq(users.email, form.data.email));

    if(user.length>0){
      return fail(400, { form });
    }

    if(email.length>0){
      return fail(400, { form });
    }

    const new_user = form.data;
    const url = "https://knihovnik.vercel.app/api/register?"+"user="+jwt.sign(new_user,JWT_SECRET);
    await sendRegistrationEmail(new_user.full_name,new_user.email,url);
    throw redirect(303, '/login');
  },
} satisfies Actions;

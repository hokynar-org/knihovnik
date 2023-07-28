import jwt from "jsonwebtoken";
import { z } from "zod";
import { message, setError, superValidate } from "sveltekit-superforms/server";
import { redirect } from "@sveltejs/kit";
import { users } from "$lib/server/db/schema";
import { db } from "$lib/server/db/drizzle";
import { eq } from "drizzle-orm";
import { sendRegistrationEmail } from "$lib/server/mail";
import { JWT_SECRET } from "$env/static/private";
import type { PageServerLoad, Actions } from "./$types";
import type { UserRegister } from "$lib/types";

const schema = z.object({
  user_name: z.string().min(2),
  full_name: z.string().min(1),
  password: z.string().min(4),
  pronouns: z.string(),
  email: z.string().email(),
});

export const load = (async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, "/");
  }

  const form = await superValidate(schema);
  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (locals.user) {
      throw redirect(303, "/");
    }
    const form = await superValidate(request, schema);

    if (!form.valid) {
      return message(form, "Enter all of the required information", {
        status: 400,
      });
    }
    let user;
    let email;
    try {
      user = await db
        .select()
        .from(users)
        .where(eq(users.user_name, form.data.user_name));
      email = await db
        .select()
        .from(users)
        .where(eq(users.email, form.data.email));
    } catch (error) {
      return message(form, "Internal Error", { status: 500 });
    }

    if (user.length > 0) {
      setError(form, "user_name", "This user name has already been taken");
      return message(form, "This user name has already been taken", {
        status: 400,
      });
    }

    if (email.length > 0) {
      setError(form, "email", "You already have an account");
      return message(form, "You already have an account", { status: 400 });
    }

    const new_user = form.data as UserRegister;
    const url =
      "https://knihovnik.vercel.app/api/register?" +
      "user=" +
      jwt.sign(new_user, JWT_SECRET);
    await sendRegistrationEmail(new_user.full_name, new_user.email, url);
    throw redirect(303, "/register/success");
  },
} satisfies Actions;

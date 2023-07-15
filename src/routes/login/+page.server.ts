import bcrypt from "bcryptjs";
import { z } from "zod";
import { superValidate, message } from "sveltekit-superforms/server";
import { fail, type Actions, redirect } from "@sveltejs/kit";
import { users, sessions } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db/drizzle";
import type { PgUUID } from "drizzle-orm/pg-core";
import type { PageServerLoad } from "./$types";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  stay: z.boolean(),
});

export const load: PageServerLoad = (async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, "/");
  }
  const form = await superValidate(schema);

  return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  login: async ({ cookies, request, locals }) => {
    if (locals.user) {
      throw redirect(303, "/");
    }

    const form = await superValidate(request, schema);

    if (!form.valid) {
      return message(form, "Enter valid email and password", { status: 400 });
    }

    const email = form.data.email;
    const password = form.data.password;
    let found_users;
    try {
      found_users = await db.select().from(users).where(eq(users.email, email));
    } catch (error) {
      return message(form, "Internal Error", { status: 500 });
    }
    if (found_users.length == 0) {
      return message(form, "Invalid email or password", { status: 400 });
    }
    const user = found_users[0];
    const password_auth = await bcrypt.compare(
      password,
      String(user.password_hash)
    );

    if (!password_auth) {
      return message(form, "Invalid email or password", { status: 400 });
    }
    let session;
    try {
      session = await db
        .insert(sessions)
        .values({
          auth_token: crypto.randomUUID(),
          user_id: user.id,
        })
        .returning();
    } catch (error) {
      return message(form, "Internal Error", { status: 500 });
    }

    if (form.data.stay) {
      cookies.set("session", String(session[0].auth_token), {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30,
      });
    } else {
      cookies.set("session", String(session[0].auth_token), {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
    }
    throw redirect(303, "/");
  },
} satisfies Actions;

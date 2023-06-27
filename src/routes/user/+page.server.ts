import { z } from "zod";
import { superValidate } from "sveltekit-superforms/server";
import type { PageServerLoad, Actions } from "./$types.d.ts";
import { fail, redirect } from "@sveltejs/kit";
import { borrow_asks, sessions, users } from "$lib/server/db/schema";
import { db } from "$lib/server/db/drizzle";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const schema = z.object({
  user_name: z.string().min(2),
  full_name: z.string().min(1),
  pronouns: z.string(),
});

const schema_password = z.object({
  old_password: z.string().min(4),
  new_password: z.string().min(4),
});

export const load = (async ({ locals, cookies }) => {
  if (!locals.user) {
    throw redirect(302, "/login");
  }

  const form = await superValidate(schema);
  const form_password = await superValidate(schema_password);
  const found_borrow_asks = await db
    .select()
    .from(borrow_asks)
    .where(eq(borrow_asks.lender_id, locals.user.id));
  
  return {
    borrow_asks: found_borrow_asks,
    form: form,
    form_password: form_password,
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  update: async ({ request, cookies, locals }) => {
    if (!locals.user) {
      throw redirect(303, "/login");
    }
    const form = await superValidate(request, schema);
    if (!form.valid) {
      return fail(400, { form });
    }
    const user_session = cookies.get("session");
    const db_session = await db
      .select()
      .from(sessions)
      .where(eq(sessions.auth_token, String(user_session)));

    if (db_session.length == 0) {
      throw redirect(303, "/login");
    }

    await db
      .update(users)
      .set({
        user_name: form.data.user_name,
        full_name: form.data.full_name,
        pronouns: form.data.pronouns,
      })
      .where(eq(users.id, Number(db_session[0].user_id)));

    throw redirect(303, "/user");
  },
  update_password: async ({ request, cookies, locals }) => {
    if (!locals.user) {
      throw redirect(302, "/login");
    }
    const form = await superValidate(request, schema_password);

    if (!form.valid) {
      return fail(400, { form });
    }
    const session = cookies.get("session");

    if (!session) {
      return fail(400, { form });
    }

    const user_session = cookies.get("session");
    const db_sessions = await db
      .select()
      .from(sessions)
      .where(eq(sessions.auth_token, String(user_session)));

    if (db_sessions.length == 0) {
      throw redirect(303, "/login");
    }

    const found_users = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(db_sessions[0].user_id)));

    if (found_users.length == 0) {
      throw redirect(303, "/login");
    }

    const old_password = form.data.old_password;
    const password_auth = await bcrypt.compare(
      old_password,
      String(found_users[0].password_hash)
    );
    if (!password_auth) {
      return fail(400, { form });
    }
    await db
      .update(users)
      .set({
        password_hash: await bcrypt.hash(form.data.new_password, 10),
      })
      .where(eq(users.id, Number(db_sessions[0].user_id)));

    throw redirect(303, "/user");
  },
} satisfies Actions;

import bcrypt from "bcryptjs";
import { z } from "zod";
import { superValidate } from "sveltekit-superforms/server";
import { fail, redirect } from "@sveltejs/kit";
import { borrow_request, items, users } from "$lib/server/db/schema";
import { db } from "$lib/server/db/drizzle";
import { eq } from "drizzle-orm";
import { JWT_SECRET } from "$env/static/private";
import jwt from "jsonwebtoken";
import type { PageServerLoad, Actions } from "./$types.d.ts";
import type { PrivateUserSafe, PublicUserSafe, Session, User } from "$lib/types.js";

const schema = z.object({
  user_name: z.string().min(2),
  full_name: z.string().min(1),
  pronouns: z.string(),
});

const schemaPassword = z.object({
  old_password: z.string().min(4),
  new_password: z.string().min(4),
});

export const load = (async ({ locals, cookies }) => {
  if (!locals.user) {
    throw redirect(302, "/login");
  }

  const form = await superValidate(schema);
  const formPassword = await superValidate(schemaPassword);
  const foundBorrowRequests = await db
    .select()
    .from(borrow_request)
    .where(eq(borrow_request.lender_id, Number(locals.user.id)));

  let notifications: any[] = [];

  for (const borrowRequest of foundBorrowRequests) {
    const borrower = await db.select()
      .from(users)
      .where(eq(users.id, Number(borrowRequest.borrower_id)));
    const { password_hash: password_hash, role: role, email:email, ...borrower_safe } = borrower[0] as User;
    const item = await db.select()
      .from(items)
      .where(eq(items.id, Number(borrowRequest.item_id)));
    notifications.push({ borrowRequest: borrowRequest, item: item[0], borrower: borrower_safe as PrivateUserSafe });
  }

  return {
    notifications: notifications,
    form: form,
    form_password: formPassword,
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

    await db
      .update(users)
      .set({
        user_name: form.data.user_name,
        full_name: form.data.full_name,
        pronouns: form.data.pronouns,
      })
      .where(eq(users.id, Number(locals.user.id)));
    const session_jwt = cookies.get('session_jwt') as string;
    const session = jwt.verify(session_jwt, JWT_SECRET) as Session;
    const user_safe = session.user_safe;
    const new_session: Session = {
      session_end: Date.now() + (session.session_stay ? 7 * 24 * 60 * 60 * 1000 : 4 * 60 * 60 * 1000),
      session_stay: session.session_stay,
      user_safe: {
        id: user_safe.id,
        email: user_safe.email,
        role: user_safe.role,
        user_name: form.data.user_name,
        full_name: form.data.full_name,
        pronouns: form.data.pronouns,
      },
    }
    const new_session_jwt = jwt.sign(new_session, JWT_SECRET);
    cookies.set("session_jwt", String(new_session_jwt), {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    throw redirect(303, "/user");
  },

  update_password: async ({ request, cookies, locals }) => {
    if (!locals.user) {
      throw redirect(302, "/login");
    }
    const form = await superValidate(request, schemaPassword);

    if (!form.valid) {
      return fail(400, { form });
    }

    const found_users = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(locals.user.id)));

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
      .where(eq(users.id, Number(locals.user.id)));

    throw redirect(303, "/user");
  },
} satisfies Actions;

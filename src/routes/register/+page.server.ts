import { z } from "zod";
import { superValidate } from "sveltekit-superforms/server";
import type { PageServerLoad, Actions } from "./$types.d.ts";
import { fail, redirect } from "@sveltejs/kit";

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { db_url } from '$env/static/private';
import { users } from '$lib/server/db/schema';

const schema = z.object({
  username: z.string().min(2),
  name: z.string().min(1),
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
    console.log("POST", form);

    if (!form.valid) {
      return fail(400, { form });
    }

    const client = postgres(db_url+"?sslmode=require");
    const db_drizzle = drizzle(client);
    await db_drizzle.insert(users).values({ fullName: form.data.name, phone: form.data.email});
    // TODO: Do something with the validated data

    throw redirect(303, '/');

    return { form };
  },
} satisfies Actions;

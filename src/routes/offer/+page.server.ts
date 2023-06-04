import { redirect, type Actions, fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import {db} from '$lib/server/db/drizzle'
import { items } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { superValidate } from "sveltekit-superforms/server";

const item_form_schema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
});

export const load = (async ({locals}) => { 
  if (!locals.user) {
    throw redirect(302, '/login')
  }
  const user_items = await db.select().from(items).where(eq(items.owner_id,locals.user.id));
  return {
    user_items:user_items,
    item_form:superValidate(item_form_schema)
  }
}) satisfies PageServerLoad;

export const actions: Actions = {
  // Add new item 
  new_item: async ({ request, locals }) => {
    if (!locals.user) {
      throw redirect(302, '/')
    }

    const form = await superValidate(request, item_form_schema);
    if (!form.valid) {
      return fail(400, { form });
    }
    try {
      await db.insert(items).values({
        name: form.data.name,
        description: form.data.description,
        owner_id: locals.user.id,
        holder_id: locals.user.id,
      })
    } catch (error) {
      console.error(error)
      return fail(500, {message: "Internal Error",});
    }
  },
  // Remove user owned item 
  remove_item: async ({ url, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/login')
		}
		const id = url.searchParams.get("id");
		if (!id) {
			return fail(400, { message: "Invalid request" })
		}
    
		try {
			const found_items = await db.select().from(items).where(eq(items.id, Number(id)));
      if (found_items.length==0) {
        return fail(400, { message: "Invalid request" })
      }
      const item = found_items[0];
      if(item.owner_id != locals.user.id){
        return fail(400, { message: "Invalid request" })
      }
      await db.delete(items).where(eq(items.id, Number(id)));
		} catch (err) {
			console.error(err)
			return fail(500, {
				message: "Database Error",
			})
		}
    throw redirect(303, '/offer');
	},
}

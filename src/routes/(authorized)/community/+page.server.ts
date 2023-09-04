import { redirect, type Actions, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db/drizzle';
import { borrow_requests, communities, items, user_community_relations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import type { Item, PublicItemSafe } from '$lib/types';
import { getMyItems } from '$lib/server/item_load';

const community_form_schema = z.object({
  name: z.string().min(2),
  description: z.string().min(0),
});

export const load = (async ({ locals }) => {
  if(!locals.user){
    throw redirect(301,"/login")
  }
  const user = locals.user
  return {
    community_form: superValidate(community_form_schema),
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  // Add new item
  new_community: async ({ request, locals }) => {
    if (!locals.user) {
      throw redirect(302, '/login');
    }
    const user = locals.user;
    const form = await superValidate(request, community_form_schema);
    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const community = (await db.insert(communities).values({
        name: form.data.name as string,
        description: form.data.description as string,
      }).returning())[0];
      await db.insert(user_community_relations).values({
        community_id:community.id,
        user_id:user.id,
        role:'ADMIN',
      });
    } catch (error) {
      console.error(error);
      return fail(500, { message: 'Internal Error' });
    }
  },
  // Remove user owned item
  remove_item: async ({ url, locals }) => {
    if (!locals.user) {
      throw redirect(302, '/login');
    }

    const id = url.searchParams.get('id');

    if (!id) {
      return fail(400, { message: 'Invalid request' });
    }

    try {
      const found_items = await db
        .select()
        .from(items)
        .where(eq(items.id, Number(id)));
      if (found_items.length == 0) {
        return fail(400, { message: 'Invalid request' });
      }
      const item = found_items[0];
      if (item.owner_id != locals.user.id) {
        return fail(400, { message: 'Invalid request' });
      }
      await db
        .delete(borrow_requests)
        .where(eq(borrow_requests.item_id, Number(id)));
      await db.delete(items).where(eq(items.id, Number(id)));
    } catch (err) {
      console.error(err);
      return fail(500, {
        message: 'Database Error',
      });
    }
    throw redirect(303, '/offer');
  },
};

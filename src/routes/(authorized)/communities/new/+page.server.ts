import { redirect, type Actions, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db/drizzle';
import { borrow_requests, communities, items, user_community_relations } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import type { Item, PublicItemSafe } from '$lib/types';
import { getMyItems } from '$lib/server/item_load';

const community_form_schema = z.object({
  name: z.string().min(2),
  description: z.string().min(0),
  visibility: z.boolean().default(false),
});

export const load = (async ({ locals }) => {
  if(!locals.user){
    throw redirect(301,"/login")
  }
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
    console.log(form.data)
    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const community = (await db.insert(communities).values({
        name: form.data.name as string,
        description: form.data.description as string,
        visibility: form.data.visibility,
      }).returning())[0];
      await db.insert(user_community_relations).values({
        community_id:community.id,
        user_id:user.id,
        role:'ADMIN',
      });
      redirect(301, '/community/'+community.id)
    } catch (error) {
      return fail(500, { message: 'Internal Error' });
    }
  },
};

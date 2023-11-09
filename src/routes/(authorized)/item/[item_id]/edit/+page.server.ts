import { db } from '$lib/server/db/drizzle';
import {
  borrow_requests,
  communities,
  community_messages,
  items,
  user_community_relations,
  users,
} from '$lib/server/db/schema';
import { and, eq, not, or } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { error, redirect, type Actions, fail } from '@sveltejs/kit';
import { getFileUrl } from '$lib/server/bucket';
import { getCommunityItems, getShelfItems } from '$lib/server/item_load';
import { item_select, user_select } from '$lib/server/db/selects';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';

const item_form_schema = z.object({
  name: z.string().min(2).max(64),
  description: z.string().min(0).max(512),
  files: z.string(),
  hasMainPic: z.boolean(),
  iconName:z.string().nullable(),
  transferType:z.enum(["BORROW","GIVE","TRANSITIVE"]),
});

export const load = (async ({ locals, params }) => {
  if (!locals.user) {
    throw redirect(301, '/login');
  }
  if (!params.item_id) {
    throw error(400);
  }
  const item_id = params.item_id;

  const user = locals.user;
  const results = await Promise.all([
    db.select(item_select).from(items).where(eq(items.id, item_id)),
  ]);
  if (results[0].length == 0) {
    throw error(404);
  }
  const item = results[0][0];
  if (user.id != item.owner_id) {
    throw error(401);
  }
  if (item.holder_id != item.owner_id) {
    throw error(400);
  }
  const form = await superValidate(item_form_schema);
  return { form: form };
}) satisfies PageServerLoad;

export const actions: Actions = {
  // Add new item
  edit: async ({ request, locals, params }) => {
    if (!locals.user) {
      throw redirect(302, '/login');
    }

    if (!params.item_id) {
      throw error(400);
    }

    const item_id = params.item_id;

    const form = await superValidate(request, item_form_schema);
    if (!form.valid) {
      return fail(400, { form });
    }

    const found_items = await db
      .select()
      .from(items)
      .where(eq(items.id, item_id));

    if (found_items.length == 0) {
      return fail(404, { form });
    }

    const item = found_items[0];

    const toNewIcon = !form.data.hasMainPic && form.data.iconName
    const toNewImage = form.data.hasMainPic && form.data.files
    const change = toNewIcon || toNewImage

    const new_hasMainPick = change?form.data.hasMainPic:item.hasMainPic;
    const new_image_src   = !toNewIcon ?(change&&toNewImage?form.data.files   :item.image_src):null;
    const new_iconName    = !toNewImage?(change&&toNewIcon ?form.data.iconName:item.iconName) :null;

    try {
      const new_item = await db
        .update(items)
        .set({
          transfeType: form.data.transferType,
          name: form.data.name,
          description: form.data.description,
          hasMainPic:new_hasMainPick,
          image_src: new_image_src,
          iconName: new_iconName,
        })
        .where(eq(items.id, item_id)).returning();
    } catch (error) {
      console.error(error);
      return fail(500, { message: 'Internal Error' });
    }
  },
};

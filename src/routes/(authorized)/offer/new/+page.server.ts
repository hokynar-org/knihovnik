import { redirect, type Actions, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db/drizzle';
import { borrow_requests, communities, item_visibility, items, user_community_relations } from '$lib/server/db/schema';
import { and, eq, or } from 'drizzle-orm';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import type { Item, PublicItemSafe } from '$lib/types';
import { getMyItems } from '$lib/server/item_load';
import {item_select} from '$lib/server/db/selects'

const item_form_schema = z.object({
  name: z.string().min(2),
  description: z.string().min(0),
  visibility: z.boolean(),
  files: z.string(),
  hasMainPic: z.boolean(),
  iconName:z.string().nullable(),
  transferType:z.enum(["BORROW","GIVE","TRANSITIVE"]),
});

export const load = (async ({ locals }) => {
  if(!locals.user){
    throw redirect(301,"/login")
  }
  const user = locals.user;

  return {
    item_form: superValidate(item_form_schema),
    // communities:user_communities.flatMap((value)=>{return value.communities})
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
  // Add new item
  new_item: async ({ request, locals }) => {
    if (!locals.user) {
      throw redirect(302, '/login');
    }
    const user = locals.user;
    const form = await superValidate(request, item_form_schema);
    // console.log(form.errors,form.data.hasMainPic,form.data.iconName);
    // return fail(400, { form });
    if (!form.valid) {
      return fail(400, { form });
    }
    const files = form.data.files.split(',');

    try {
      const item = (await db.insert(items).values({
        transfeType: form.data.transferType,
        hasMainPic: form.data.hasMainPic,
        iconName: form.data.iconName,
        name: form.data.name as string,
        description: form.data.description as string,
        owner_id: locals.user.id,
        holder_id: locals.user.id,
        image_src:files[0],
      }).returning(item_select))[0];
      if(form.data.visibility){
        const user_communities = await db.select().from(communities).innerJoin(user_community_relations,and(eq(communities.id,user_community_relations.community_id),eq(user_community_relations.user_id,user.id),or(eq(user_community_relations.role,'ADMIN'),eq(user_community_relations.role,'MEMBER'))))
        const inserted_visibilities = user_communities.flatMap((value)=>{return {community_id:value.communities.id,item_id:item.id}});
        await db.insert(item_visibility).values(inserted_visibilities)
      }
    } catch (error) {
      console.error(error);
      return fail(500, { message: 'Internal Error' });
    }
    throw redirect(303, '/offer');
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
        .where(eq(items.id, id));
      if (found_items.length == 0) {
        return fail(400, { message: 'Invalid request' });
      }
      const item = found_items[0];
      if (item.owner_id != locals.user.id) {
        return fail(400, { message: 'Invalid request' });
      }
      await db
        .delete(borrow_requests)
        .where(eq(borrow_requests.item_id, id));
      await db.delete(items).where(eq(items.id, id));
    } catch (err) {
      console.error(err);
      return fail(500, {
        message: 'Database Error',
      });
    }
    throw redirect(303, '/offer');
  },
};

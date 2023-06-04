import { fail, redirect, type Actions} from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import {db} from '$lib/server/db/drizzle'
import { borrow_asks, items, users } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import type { PublicItemSafe, PublicUserSafe } from "$lib/types";

export const load = (async ({locals}) => { 
  if (!locals.user) {
    throw redirect(302, '/login')
  }
  const all_items = await db.select().from(items);
  let offers:Array<{user:PublicUserSafe, item:PublicItemSafe}>=[];
  for (let i = 0; i < all_items.length; i++) {
    const item = all_items[i];
    const found_users = await db.select().from(users).where(eq(users.id,Number(item.owner_id)));
    if(found_users.length==0){
      continue;
    }
    const user=found_users[0];

    const public_user_safe: PublicUserSafe={
      user_name:String(user.user_name),
      full_name:String(user.full_name),
      id:Number(user.id)
    }
    const public_item_safe: PublicItemSafe={
      name:String(item.name),
      description:String(item.description),
      id:Number(item.id),
      user_id:Number(user.id),
    }

    offers[i]={user:public_user_safe,item:public_item_safe}
  }
  return {
    offers:offers,
  }
}) satisfies PageServerLoad;

export const actions: Actions = {
  new_borrow_ask: async ({ url, locals }) => {
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
      if(item.holder_id==locals.user.id){
        return fail(400, { message: "Invalid request" })
      }
      await db.insert(borrow_asks).values({
        lender_id:   item.holder_id,
        borrower_id: locals.user.id,
        item_id: item.id
      })

    } catch (error) {
			console.error(error)
			return fail(500, {
				message: "Database Error",
			})
		}

    throw redirect(303, '/borrow');
	},
}


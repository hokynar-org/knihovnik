import { redirect} from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import {db} from '$lib/server/db/drizzle'
import { items, users } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export const load = (async ({locals}) => { 
  if (!locals.user) {
    throw redirect(302, '/login')
  }
  const all_items = await db.select().from(items);
  let offers:Array<any>=[];
  for (let i = 0; i < all_items.length; i++) {
    const item = all_items[i];
    const found_users = await db.select().from(users).where(eq(users.id,Number(item.user_id)));
    if(found_users.length==0){
      continue;
    }
    const user=found_users[0];
    const {password_hash: password_hash,...user_safe} = user; 
    offers[i]={user:user_safe,item:item}
  }
  return {
    offers:offers,
  }
}) satisfies PageServerLoad;


import type { LayoutServerLoad } from './$types'
import {db} from '$lib/server/db/drizzle'
import { borrow_asks } from '$lib/server/db/schema'

export const load: LayoutServerLoad = async ({ locals }) => {
  await db.delete(borrow_asks)
  return {
    user: locals.user,
  }
}

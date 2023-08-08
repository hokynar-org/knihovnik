import { db } from '$lib/server/db/drizzle';
import { borrow_requests, request_actions, items, users } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { BorrowRequest, Offer } from '$lib/types';

export const load = (async ({ locals,params }) => {
  const borrow_request_id=params.borrow_request_id
  const found_borrow_requests:BorrowRequest[] = await db
  .select()
  .from(borrow_requests).where(eq(borrow_requests.id,borrow_request_id));
  const found_request_actions = await db
  .select()
  .from(request_actions).where(eq(request_actions.borrow_request_id,borrow_request_id));
  return {
    borrow_request: found_borrow_requests[0],
    request_actions: found_request_actions
  };
}) satisfies PageServerLoad;

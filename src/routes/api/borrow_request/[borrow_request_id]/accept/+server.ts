import { error, fail, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/drizzle';
import {borrow_requests} from '$lib/server/db/schema'
import { eq } from 'drizzle-orm';
import type { BorrowRequest } from '$lib/types';

export const POST = (async ({ request, params, locals, url, route }) => {
  if (!locals.user) {
    throw error(401);
  }
  if (!params.borrow_request_id) {
    throw error(400);
  }
  const user_id = locals.user.id;
  const borrow_request_id = params.borrow_request_id as string;
  const found_borrow_requests:Array<BorrowRequest> = await db.select().from(borrow_requests).where(eq(borrow_requests.id, Number(borrow_request_id)));
  if(found_borrow_requests.length==0) {
    throw error(400);
  }
  const old_borrow_request=found_borrow_requests[0];
  if(old_borrow_request.status!='PENDING'){
    throw error(400);
  }
  if(old_borrow_request.lender_id!=user_id){
    throw error(401);
  }
  const new_borrow_requests = await db.update(borrow_requests).set({status:'ACCEPTED'}).where(eq(borrow_requests.id, Number(borrow_request_id))).returning();
  return json(new_borrow_requests[0]);
}) satisfies RequestHandler;
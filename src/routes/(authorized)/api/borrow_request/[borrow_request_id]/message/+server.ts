import { error, fail, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/drizzle';
import {borrow_requests, request_actions} from '$lib/server/db/schema'
import { eq } from 'drizzle-orm';
import type { BorrowRequest } from '$lib/types';

export const POST = (async ({ request, params, locals, url, route }) => {
  if (!locals.user) {
    throw error(401);
  }
  if (!params.borrow_request_id) {
    throw error(400);
  }
  const body = await (await request).json()
  const message = body.message;
  const user_id = locals.user.id;
  const borrow_request_id = params.borrow_request_id as string;
  const found_borrow_requests:Array<BorrowRequest> = await db.select().from(borrow_requests).where(eq(borrow_requests.id, Number(borrow_request_id)));
  if(found_borrow_requests.length==0) {
    throw error(400);
  }
  const borrow_request=found_borrow_requests[0];
  if(borrow_request.lender_id!=user_id && borrow_request.borrower_id!=user_id){
    throw error(401);
  }
  try {
    const new_requests_actions = await db.insert(request_actions).values({
      borrow_request_id:Number(borrow_request_id),
      user_id:user_id,
      type: 'MESSAGE',
      message: message,
      }).returning();
    return json(new_requests_actions[0]);
  } catch (err) {
    throw error(500);
  }
}) satisfies RequestHandler;
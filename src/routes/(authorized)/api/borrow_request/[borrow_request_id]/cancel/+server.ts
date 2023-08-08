import { error, fail, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/drizzle';
import {borrow_requests,request_actions} from '$lib/server/db/schema'
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
    throw error(404);
  }
  const old_borrow_request=found_borrow_requests[0];
  if(old_borrow_request.borrower_id!=user_id){
    throw error(401);
  }
  if(old_borrow_request.status!='PENDING'){
    throw error(400);
  }
  try {
    const delete_borrow_requests:Promise<any> = db.delete(borrow_requests).where(eq(borrow_requests.id, Number(borrow_request_id))).returning();
    const delete_request_actions:Promise<any> = db.delete(request_actions).where(eq(request_actions.borrow_request_id, Number(borrow_request_id))).returning();
    const results:any = await Promise.all([delete_borrow_requests,delete_request_actions]);
    return json(results[0][0]);
  } catch (err) {
    throw error(500);
  }

}) satisfies RequestHandler;
import { error, fail, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/drizzle';
import {borrow_requests, items, notifications, request_actions} from '$lib/server/db/schema'
import { and, eq } from 'drizzle-orm';
import type { BorrowRequest, Notification, PublicItemSafe, RequestAction } from '$lib/types';
import { pusher } from '$lib/server/pusher'

export const POST = (async ({ request, params, locals, url, route }) => {
  if (!locals.user) {
    throw error(401);
  }
  const user_id = locals.user.id;
  const pusher_user = {
    id: String(user_id),
  };
  const body = await (await request).text()
  const socketId = body.split('&')[0].split('=')[1]
  const chanelName = body.split('&')[1].split('=')[1]
  const chanelType = chanelName.split('-')[1]
  if(chanelType!='borrow_request'){
    throw error(400);
  }
  const borrow_request_id=Number(chanelName.split('-')[2]);
  const foudn_borrow_requests:{item:PublicItemSafe,borrow_request:BorrowRequest}[]= await db.select({
  item: {
    name: items.name,
    description: items.description,
    id: items.id,
    owner_id: items.owner_id,
  },
  borrow_request: {
    status: borrow_requests.status,
    id: borrow_requests.id,
    borrower_id: borrow_requests.borrower_id,
    lender_id: borrow_requests.lender_id,
    item_id: borrow_requests.item_id,
    timestamp: borrow_requests.timestamp,
  },}).from(borrow_requests).where(eq(borrow_requests.id,borrow_request_id))
  .innerJoin(items,eq(items.id,borrow_requests.item_id));
  const borrow_request=foudn_borrow_requests[0].borrow_request;
  const item=foudn_borrow_requests[0].item;
  const user_ids = [borrow_request.lender_id,borrow_request.borrower_id,item.owner_id]
  if(!user_ids.includes(user_id)){
    throw error(403);
  }
  const authResponse = pusher.authorizeChannel(socketId, chanelName);
  return json(authResponse);
}) satisfies RequestHandler;
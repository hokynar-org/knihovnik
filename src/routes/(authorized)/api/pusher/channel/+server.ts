import { error, fail, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/drizzle';
import {borrow_requests, communities, items, notifications, request_actions, user_community_relations} from '$lib/server/db/schema'
import { and, eq, or } from 'drizzle-orm';
import type { BorrowRequest, Notification, PublicItemSafe, RequestAction } from '$lib/types';
import { pusher } from '$lib/server/pusher'
import { borrow_request_select, item_select } from '$lib/server/db/selects';

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
  const channelName = body.split('&')[1].split('=')[1]
  const channelType = channelName.split('-')[1]
  const channelId   = channelName.split('-')[2]
  if(channelType=='borrow_request'){
      const borrow_request_id=channelId;
      const found_borrow_requests:{item:PublicItemSafe,borrow_request:BorrowRequest}[]= await db.select({
      item: item_select,
      borrow_request: borrow_request_select,}).from(borrow_requests).where(eq(borrow_requests.id,borrow_request_id))
      .innerJoin(items,eq(items.id,borrow_requests.item_id));
      const borrow_request=found_borrow_requests[0].borrow_request;
      const item=found_borrow_requests[0].item;
      const user_ids = [borrow_request.lender_id,borrow_request.borrower_id,item.owner_id]
      if(!user_ids.includes(user_id)){
        throw error(403);
      }
      const authResponse = pusher.authorizeChannel(socketId, channelName);
      return json(authResponse);
    }
    else if(channelType=='community'){
      const community_id=channelId;
      const found_communities= await db.select().from(communities).where(eq(communities.id,community_id))
      if(found_communities.length==0){
        throw error(404);
      }
      const found_realations = await db.select().from(user_community_relations).where(and(eq(user_community_relations.user_id,user_id),or(eq(user_community_relations.role,'ADMIN'),eq(user_community_relations.role,'MEMBER'))));
      if(found_realations.length==0){
        throw error(401);
      }
      const authResponse = pusher.authorizeChannel(socketId, channelName);
      return json(authResponse);
    }
    else{
      throw error(400);
    }
}) satisfies RequestHandler;
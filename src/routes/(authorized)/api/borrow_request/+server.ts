import { error, fail, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/drizzle';
import {borrow_requests, item_visibility, items, notifications, request_actions, user_community_relations, users} from '$lib/server/db/schema'
import { and, eq, or,ne } from 'drizzle-orm';
import type { BorrowRequest, Item, PublicItemSafe } from '$lib/types';
import { pusher } from '$lib/server/pusher';
import { borrow_request_select, item_select } from '$lib/server/db/selects';
import { notifyUser, notifyUsers } from '$lib/server/notification';

export const POST = (async ({ locals, url}) => {
    if (!locals.user) {
        throw error(401);
    }
    const user = locals.user;
    if(!Number(url.searchParams.get('item_id'))){
        throw error(400);
    }
    const item_id = Number(url.searchParams.get('item_id'));

    const found_items = await db.select(item_select).from(items).where(eq(items.id, item_id));
    if(found_items.length==0){
        throw error(404);
    }
    const visibility = await db.select().from(item_visibility).where(eq(item_visibility.item_id,item_id)).innerJoin(user_community_relations,and(eq(item_visibility.community_id,user_community_relations.community_id),and(eq(user_community_relations.user_id, user.id),or(eq(user_community_relations.role, 'ADMIN'),eq(user_community_relations.role, 'MEMBER')))));
    const item = found_items[0];
    if(item.owner_id!=user.id && !item.offered && visibility.length==0){
        throw error(401);
    }
    if(item.holder_id==user.id){
        throw error(400);
    }
    const found_borrow_requests:Array<BorrowRequest> =
    await db.select().from(borrow_requests).where(and(or(eq(borrow_requests.status,'PENDING'),eq(borrow_requests.status,'ACCEPTED')),eq(borrow_requests.item_id, Number(item.id)),eq(borrow_requests.borrower_id, Number(user.id))));
    if(found_borrow_requests.length>0) {
        throw error(400);
    }
    if(user.id==item.owner_id){
        const [borrow_request,action,other_borrow_requests] = await db.transaction(async (tx)=>{
            const [borrow_request] = await tx.insert(borrow_requests).values({
                lender_id: item.holder_id as number,
                borrower_id: user.id as number,
                item_id: item.id as number,
                status: 'ACCEPTED',
                }).returning(borrow_request_select);
            const [action] = await tx.insert(request_actions).values({
                borrow_request_id:borrow_request.id,
                user_id:user.id,
                type: 'CREATE',
                message: '',
                }).returning();
            const other_borrow_requests = await tx.update(borrow_requests).set({
                status:'DENIED'
                }).where(and(ne(borrow_requests.id,borrow_request.id),eq(borrow_requests.status,'PENDING'),eq(borrow_requests.item_id,borrow_request.item_id))).returning(borrow_request_select)
            if (other_borrow_requests.length>0){
                const actions_query = other_borrow_requests.flatMap((value)=>{
                    return {
                    borrow_request_id:value.id,
                    user_id:user.id,
                    type: 'DENY',
                    message: '',
                    }
                })
                const [actions] = await tx.insert(request_actions).values(actions_query).returning();
            }
            return [borrow_request,action,other_borrow_requests]
        })
        await notifyUser({
            user_id: borrow_request.lender_id,
            text: "User " + locals.user.user_name + " wants " + item.name + ' back',
            url: '/borrow_request/'+String(borrow_request.id),
        })
        if(other_borrow_requests.length>0){
            await notifyUsers({
              user_ids: other_borrow_requests.flatMap((value)=>{
                return value.borrower_id
              }),
              text: "User " + locals.user.user_name + " denied your request for " + item.name,
              url: '/borrow_request/'+String(borrow_request.id),
            })
          }
        return json(borrow_request);
    }
    else{
        const borrow_request = await db.transaction(async (tx)=>{
            const [borrow_request] = await tx.insert(borrow_requests).values({
                lender_id: item.holder_id as number,
                borrower_id: user.id as number,
                item_id: item.id as number,
                }).returning(borrow_request_select);
            const [action] = await tx.insert(request_actions).values({
                borrow_request_id:borrow_request.id,
                user_id:user.id,
                type: 'CREATE',
                message: '',
                }).returning();
            return borrow_request
        })
        await notifyUser({
                url:'/borrow_request/'+String(borrow_request.id),
                text: "User " + locals.user.user_name + " wants " + item.name,
                user_id:borrow_request.lender_id,
            })
        return json(borrow_request);
    }
}) satisfies RequestHandler;
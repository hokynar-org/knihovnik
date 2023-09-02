import { alias } from "drizzle-orm/pg-core";
import { db } from "./db/drizzle";
import { borrow_requests, items, users } from "./db/schema";
import { and, eq, or } from "drizzle-orm";
import { getFileUrl } from "./bucket";
import type { BorrowRequest, PublicItemSafe, PublicUserSafe } from "$lib/types";
import { error } from "@sveltejs/kit";

export const getItem = async (item_id:number)=>{
    const holder= alias(users,'holder');
    const owner = alias(users,'owner');
    const borrower = alias(users,'borrower');
    const lender = alias(users,'lender');
    const result_item:Promise<{holder:PublicUserSafe,owner:PublicUserSafe,item:PublicItemSafe}[]> =
    db.select({
        holder: {
            id: holder.id,
            full_name: holder.full_name,
            user_name: holder.user_name,
            pronouns: holder.pronouns,
        },
        owner: {
            id: owner.id,
            full_name: owner.full_name,
            user_name: owner.user_name,
            pronouns: owner.pronouns,
        },
        item: {
            name: items.name,
            description: items.description,
            id: items.id,
            owner_id: items.owner_id,
            holder_id: items.holder_id,
            image_src: items.image_src
        },
    })
    .from(items).where(eq(items.id, item_id))
    .innerJoin(owner,  eq(items.owner_id, owner.id))
    .innerJoin(holder, eq(items.holder_id, holder.id));

    const result_requests:Promise<{borrow_request:BorrowRequest,borrower:PublicUserSafe,lender:PublicUserSafe}[]>= db.select({
        borrow_request:{
            status: borrow_requests.status,
            id: borrow_requests.id,
            borrower_id: borrow_requests.borrower_id,
            lender_id: borrow_requests.lender_id,
            item_id: borrow_requests.item_id,
            timestamp: borrow_requests.timestamp,
        },
        borrower: {
            id: borrower.id,
            full_name: borrower.full_name,
            user_name: borrower.user_name,
            pronouns: borrower.pronouns,
        },
        lender: {
            id: lender.id,
            full_name: lender.full_name,
            user_name: lender.user_name,
            pronouns: lender.pronouns,
        },
    }).from(borrow_requests).where(eq(borrow_requests.item_id,item_id))
    .innerJoin(borrower,    eq(borrow_requests.borrower_id  , borrower.id))
    .innerJoin(lender,      eq(borrow_requests.lender_id    , lender.id));
    const result = await Promise.all([result_item,result_requests]);
    if(result[0].length==0){
        return null;
    }
    const image_src = await getFileUrl(result[0][0].item.image_src);
    return {
        item: {
            name:result[0][0].item.name,
            description: result[0][0].item.description,
            id: result[0][0].item.id,
            owner_id: result[0][0].item.owner_id,
            image_src: image_src,
        },
        holder: result[0][0].holder,
        owner: result[0][0].owner,
        borrow_requests: result[1]
    }
}

export const getJustItem = async (item_id:number)=>{
    const holder= alias(users,'holder');
    const owner = alias(users,'owner');
    const result:{holder:PublicUserSafe,owner:PublicUserSafe,item:PublicItemSafe}[] =
    await db.select({
        holder: {
            id: holder.id,
            full_name: holder.full_name,
            user_name: holder.user_name,
            pronouns: holder.pronouns,
        },
        owner: {
            id: owner.id,
            full_name: owner.full_name,
            user_name: owner.user_name,
            pronouns: owner.pronouns,
        },
        item: {
            name: items.name,
            description: items.description,
            id: items.id,
            owner_id: items.owner_id,
            holder_id: items.holder_id,
            image_src: items.image_src
        },
    })
    .from(items).where(eq(items.id, item_id))
    .innerJoin(owner,  eq(items.owner_id, owner.id))
    .innerJoin(holder, eq(items.holder_id, holder.id));
    if(result.length==0){
        return null;
    }
    const image_src = await getFileUrl(result[0].item.image_src);
    return {
        item: {
            name:result[0].item.name,
            description: result[0].item.description,
            id: result[0].item.id,
            owner_id: result[0].item.owner_id,
            image_src: image_src,
        },
        holder: result[0].holder,
        owner: result[0].owner,
    }
}


export const getItems = async ()=>{
        const owner = alias(users,'owner');
    const result:{owner:PublicUserSafe,item:PublicItemSafe}[] =
    await db.select({
        owner: {
            id: owner.id,
            full_name: owner.full_name,
            user_name: owner.user_name,
            pronouns: owner.pronouns,
        },
        item: {
            name: items.name,
            description: items.description,
            id: items.id,
            owner_id: items.owner_id,
            holder_id: items.holder_id,
            image_src: items.image_src
        },
    })
    .from(items).where(eq(items.offered,true))
    .innerJoin(owner,  eq(items.owner_id, owner.id))
    const image_srcs_promise = result.flatMap((value)=>{
        return getFileUrl(value.item.image_src)
    })
    const image_srcs = await Promise.all(image_srcs_promise)
    const offers = result.flatMap((value,index)=>{
        return {
            item: {
                name:value.item.name,
                description: value.item.description,
                id: value.item.id,
                owner_id: value.item.owner_id,
                image_src: image_srcs[index],
            },
            owner: value.owner
        }
    })
    return offers
}

export const getShelfItems = async (user_id:number)=>{
    const owner = alias(users,'owner');
    const result:{owner:PublicUserSafe,item:PublicItemSafe}[] =
    await db.select({
        owner: {
            id: owner.id,
            full_name: owner.full_name,
            user_name: owner.user_name,
            pronouns: owner.pronouns,
        },
        item: {
            name: items.name,
            description: items.description,
            id: items.id,
            owner_id: items.owner_id,
            holder_id: items.holder_id,
            image_src: items.image_src
        },
    })
    .from(items).where(eq(items.holder_id,user_id))
    .innerJoin(owner,  eq(items.owner_id, owner.id))
    const image_srcs_promise = result.flatMap((value)=>{
        return getFileUrl(value.item.image_src)
    })
    const image_srcs = await Promise.all(image_srcs_promise)
    const offers = result.flatMap((value,index)=>{
        return {
            item: {
                name:value.item.name,
                description: value.item.description,
                id: value.item.id,
                owner_id: value.item.owner_id,
                image_src: image_srcs[index],
            },
            owner: value.owner
        }
    })
    return offers
}

export const getMyItems = async (user_id:number)=>{
    const holder = alias(users,'holder');
    const result:{holder:PublicUserSafe,item:PublicItemSafe}[] =
    await db.select({
        item: {
            name: items.name,
            description: items.description,
            id: items.id,
            owner_id: items.owner_id,
            holder_id: items.holder_id,
            image_src: items.image_src
        },
        holder: {
            id: holder.id,
            full_name: holder.full_name,
            user_name: holder.user_name,
            pronouns: holder.pronouns,
        },
    }).from(items).where(eq(items.owner_id,user_id))
    .innerJoin(holder, eq(items.holder_id, holder.id));


    const image_srcs_promise = result.flatMap((value)=>{
        return getFileUrl(value.item.image_src)
    })
    const image_srcs = await Promise.all(image_srcs_promise)
    const offers = result.flatMap((value,index)=>{
        return {
            item: {
                name:value.item.name,
                description: value.item.description,
                id: value.item.id,
                owner_id: value.item.owner_id,
                image_src: image_srcs[index],
            },
            holder:value.holder
        }
    })
    return offers
}
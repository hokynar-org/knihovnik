import { db } from "./db/drizzle";
import { borrow_requests, item_visibility, items, user_community_relations, users } from "./db/schema";
import { and, eq, or } from "drizzle-orm";
import { getFileUrl } from "./bucket";
import type { BorrowRequest, PublicItemSafe, PublicUserSafe } from "$lib/types";
import { item_select,borrow_request_select,borrowers,lenders,owners,holders,holder_select,borrower_select,lender_select,owner_select } from "./db/selects";

export const getItem = async (item_id:number)=>{
    const result_item:Promise<{holder:PublicUserSafe,owner:PublicUserSafe,item:PublicItemSafe}[]> =
    db.select({
        holder: holder_select,
        owner: owner_select,
        item: item_select,
    })
    .from(items).where(eq(items.id, item_id))
    .innerJoin(owners,  eq(items.owner_id, owners.id))
    .innerJoin(holders, eq(items.holder_id, holders.id));

    const result_requests:Promise<{borrow_request:BorrowRequest,borrower:PublicUserSafe,lender:PublicUserSafe}[]>= db.select({
        borrow_request: borrow_request_select,
        borrower: borrower_select,
        lender: lender_select,
    }).from(borrow_requests).orderBy(borrow_requests.timestamp).where(eq(borrow_requests.item_id,item_id))
    .innerJoin(borrowers,    eq(borrow_requests.borrower_id  , borrowers.id))
    .innerJoin(lenders,      eq(borrow_requests.lender_id    , lenders.id));
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
            offered: result[0][0].item.offered,
            hasMainPic: result[0][0].item.hasMainPic,
            iconName: result[0][0].item.iconName,
            transfeType:result[0][0].item.transfeType,
        },
        holder: result[0][0].holder,
        owner: result[0][0].owner,
        borrow_requests: result[1]
    }
}

export const getJustItem = async (item_id:number)=>{
    const result:{holder:PublicUserSafe,owner:PublicUserSafe,item:PublicItemSafe}[] =
    await db.select({
        holder: holder_select,
        owner: owner_select,
        item: item_select,
    })
    .from(items).where(eq(items.id, item_id))
    .innerJoin(owners,  eq(items.owner_id, owners.id))
    .innerJoin(holders, eq(items.holder_id, holders.id));
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
            offered: result[0].item.offered,
            hasMainPic: result[0].item.hasMainPic,
            iconName: result[0].item.iconName,
            transfeType:result[0].item.transfeType,
        },
        holder: result[0].holder,
        owner: result[0].owner,
    }
}

export const getItems = async (user_id:number, offset?:number, limit?:number)=>{
    
    const db_result:{owner:PublicUserSafe,item:PublicItemSafe}[] =
    await db.selectDistinct({
        owner: owner_select,
        item: item_select,
    })
    .from(items).where(eq(items.offered,true))
    .innerJoin(owners,  eq(items.owner_id, owners.id))
    .innerJoin(item_visibility,eq(item_visibility.item_id,items.id))
    .innerJoin(user_community_relations,and(eq(item_visibility.community_id,user_community_relations.community_id),and(eq(user_community_relations.user_id, user_id),or(eq(user_community_relations.role, 'ADMIN'),eq(user_community_relations.role, 'MEMBER')))))
    .offset((offset && offset>=0)?offset:0).limit((limit && limit>0)?limit:4)

    const result: { owner: PublicUserSafe; item: PublicItemSafe; }[] = [];
    const image_srcs_promise = db_result.flatMap((value)=>{
        return getFileUrl(value.item.image_src)
    })
    const image_srcs = await Promise.all(image_srcs_promise)
    const offers = db_result.flatMap((value,index)=>{
        return {
            item: {
                name:value.item.name,
                description: value.item.description,
                id: value.item.id,
                owner_id: value.item.owner_id,
                image_src: image_srcs[index],
                offered: value.item.offered,
                hasMainPic: value.item.hasMainPic,
                iconName: value.item.iconName,
                transfeType:value.item.transfeType,
            },
            owner: value.owner
        }
    })
    return offers
}

export const getCommunityItems = async (community_id:number)=>{
    const result:{owner:PublicUserSafe,item:PublicItemSafe}[] =
    await db.select({
        owner: owner_select,
        item: item_select,
    })
    .from(items).where(and(eq(items.offered,true),eq(items.holder_id,items.owner_id)))
    .innerJoin(item_visibility,and(eq(items.id,item_visibility.item_id),eq(item_visibility.community_id,community_id)))
    .innerJoin(owners,  eq(items.owner_id, owners.id))
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
                offered: value.item.offered,
                hasMainPic: value.item.hasMainPic,
                iconName: value.item.iconName,
                transfeType:value.item.transfeType,
            },
            owner: value.owner
        }
    })
    return offers
}

export const getShelfItems = async (user_id:number)=>{
    const result:{owner:PublicUserSafe,item:PublicItemSafe}[] =
    await db.select({
        owner: owner_select,
        item: item_select,
    })
    .from(items).where(eq(items.holder_id,user_id))
    .innerJoin(owners,  eq(items.owner_id, owners.id))
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
                offered: value.item.offered,
                hasMainPic: value.item.hasMainPic,
                iconName: value.item.iconName,
                transfeType:value.item.transfeType,
            },
            owner: value.owner
        }
    })
    return offers
}

export const getMyItems = async (user_id:number)=>{
    const result:{holder:PublicUserSafe,item:PublicItemSafe}[] =
    await db.select({
        item: item_select,
        holder: holder_select,
    }).from(items).where(eq(items.owner_id,user_id))
    .innerJoin(holders, eq(items.holder_id, holders.id));

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
                offered: value.item.offered,
                hasMainPic: value.item.hasMainPic,
                iconName: value.item.iconName,
                transfeType:value.item.transfeType,
            },
            holder:value.holder
        }
    })
    return offers
}
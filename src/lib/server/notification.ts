import type { Notification } from "$lib/types"
import { and, eq } from "drizzle-orm";
import { db } from "./db/drizzle";
import { notifications, user_community_relations } from "./db/schema";
import { user_community_relation_select } from "./db/selects";
import { pusher } from "./pusher";


export const notifyUser = async (input:{url:string|null,user_id:number,text:string}) =>{
    const {url, user_id, text} = input;
    const notification = (await db.insert(notifications).values({
        user_id: user_id,
        text: text,
        url: url,
    }).returning())[0];
    await pusher.sendToUser(String(user_id), "notification", notification);
    return notification;
}

export const notifyUsers = async (input:{url:string|null,user_ids:number[],text:string}) =>{
    const {url, user_ids, text} = input;
    const notifications_query = user_ids.flatMap((value)=>{
        return {
            user_id: value,
            text: text,
            url: url,
        }
    })
    const all_notifications = (await db.insert(notifications).values(notifications_query).returning());
    const pusher_promises = all_notifications.flatMap((value)=>{
        return pusher.sendToUser(String(value.user_id), "notification", value);
    })
    await Promise.all(pusher_promises);
    return all_notifications;
}

export const notifyAdmins = async (community_id:number, input:{url:string|null,text:string}) =>{
    const {url, text} = input;
    const community_admins = await db.select(user_community_relation_select)
        .from(user_community_relations)
        .where(and(eq(user_community_relations.community_id,community_id),eq(user_community_relations.role,'ADMIN')));
    const user_ids = community_admins.map((value)=>{
        return value.user_id
    })
    const notifications_query = user_ids.map((value)=>{
        return {
            user_id: value,
            text: text,
            url: url,
        }
    })
    const all_notifications = (await db.insert(notifications).values(notifications_query).returning());
    const pusher_promises = all_notifications.map((value)=>{
        return pusher.sendToUser(String(value.user_id), "notification", value);
    })
    await Promise.all(pusher_promises);
    return all_notifications;
}
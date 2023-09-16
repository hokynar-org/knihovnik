import type { Notification } from "$lib/types"
import { db } from "./db/drizzle";
import { notifications } from "./db/schema";
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
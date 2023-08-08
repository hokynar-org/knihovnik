import { db } from '$lib/server/db/drizzle';
import { borrow_requests, request_actions } from '$lib/server/db/schema';
import { pusher } from '$lib/server/pusher'
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const log = await pusher.trigger("channel-1", "test_event", { message: "hello world" },);
    const delete_borrow_requests:Promise<any> = db.delete(borrow_requests);
    const delete_request_actions:Promise<any> = db.delete(request_actions);
    const results:any = await Promise.all([delete_borrow_requests,delete_request_actions]);
    console.log(log);
    return {}
};
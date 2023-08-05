import { pusher } from '$lib/server/pusher'
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const log = await pusher.trigger("channel-1", "test_event", { message: "hello world" },);
    console.log(log);
    return {}
};
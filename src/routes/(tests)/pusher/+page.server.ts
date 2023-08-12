import { db } from '$lib/server/db/drizzle';
import { borrow_requests, notifications, request_actions } from '$lib/server/db/schema';
import { pusher } from '$lib/server/pusher'
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import {PUSHER_KEY,PUSHER_CLUSTER} from'$env/static/private'

export const load: PageServerLoad = async () => {
    return {key:PUSHER_KEY,cluster:PUSHER_CLUSTER}
};
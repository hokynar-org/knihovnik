import { writable } from "svelte/store";
import type { PublicItemSafe, RequestAction, Notification} from "$lib/types";
import type Pusher from "pusher-js/types/src/core/pusher";

export const user_items = writable<Array<PublicItemSafe>>([]);
export const notifications = writable<Array<Notification>>([]);
export const request_actions = writable<Array<RequestAction>>([]);
export const pusher = writable<Pusher|undefined>(undefined)
import { writable } from "svelte/store";
import type { PublicItemSafe, RequestAction, Notification, PublicUserSafe} from "$lib/types";
import type Pusher from "pusher-js/types/src/core/pusher";

export const user_items = writable<Array<{item:PublicItemSafe,holder:PublicUserSafe|null}>>([]);
export const notifications = writable<Array<Notification>>([]);
export const request_actions = writable<Array<RequestAction>>([]);
export const pusher = writable<Pusher|undefined>(undefined)
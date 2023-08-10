import { writable } from "svelte/store";
import type { PublicItemSafe, RequestAction, Notification} from "$lib/types";

export const user_items = writable<Array<PublicItemSafe>>([]);
export const notifications = writable<Array<Notification>>([]);
export const request_actions = writable<Array<RequestAction>>([]);
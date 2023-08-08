import { writable } from "svelte/store";
import type { PublicItemSafe, RequestAction } from "$lib/types";
import type {NotificationBorrowRequest} from "$lib/types";

export const user_items = writable<Array<PublicItemSafe>>([]);
export const notifications = writable<Array<NotificationBorrowRequest>>([]);
export const notifications_a = writable<Array<NotificationBorrowRequest>>([]);
export const request_actions = writable<Array<RequestAction>>([]);
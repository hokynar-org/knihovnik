import { writable } from "svelte/store";
import type { Item } from "$lib/types";
import type {NotificationBorrowRequest} from "$lib/types"

export const user_items = writable<Array<Item>>([]);
export const notifications = writable<Array<NotificationBorrowRequest>>([]);
export const notifications_a = writable<Array<NotificationBorrowRequest>>([]);

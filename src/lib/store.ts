import { writable } from "svelte/store";
import type { Item } from "$lib/types";

export const user_items = writable<Array<Item>>([]);

import { writable } from 'svelte/store';

export const selectedIconId = writable<number>(-1);

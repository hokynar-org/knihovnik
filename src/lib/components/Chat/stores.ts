import { writable } from 'svelte/store';

export const composedMessage = writable<string>('');
export const enterPresses = writable<number>(0);

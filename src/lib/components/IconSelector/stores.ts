import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { writable } from 'svelte/store';

export const selectedIconNameStore = writable<string|null>(null);

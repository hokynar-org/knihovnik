import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { writable } from 'svelte/store';

export const selectedIcon = writable<IconDefinition|undefined>(undefined);

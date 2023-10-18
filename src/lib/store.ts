import { writable } from 'svelte/store';
import type {
  PublicItemSafe,
  RequestAction,
  Notification,
  PublicUserSafe,
  RequestActionMessage,
  UserOffer,
  GroupNotificaton,
} from '$lib/types';
import type Pusher from 'pusher-js/types/src/core/pusher';

export const user_items = writable<Array<UserOffer>>([]); //Note: user_items are items owned by the user. So the holder is always known.
export const notifications = writable<Array<Notification>>([]);
export const request_actions = writable<Array<RequestActionMessage>>([]);
export const pusher = writable<Pusher | undefined>(undefined);
export const groupNotificatons = writable<Array<GroupNotificaton>>([]);
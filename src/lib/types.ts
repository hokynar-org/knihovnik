import type { InferModel } from 'drizzle-orm';
import type { borrow_requests, items } from './server/db/schema';

export interface Community {
  id: number;
  dateCreated: Date;
  communityName: string;
  communityDescription: string;
  users: User[];
}

export interface User {
  id: number;
  full_name: string;
  user_name: string;
  email: string;
  pronouns: string;
  role: string;
}

export interface UserRegister {
  full_name: string;
  user_name: string;
  password: string;
  email: string;
  pronouns: string;
}

export interface PrivateUserSafe {
  id: number;
  full_name: string;
  user_name: string;
  email: string;
  pronouns: string;
  role: string;
}

export interface PublicUserSafe {
  user_name: string;
  full_name: string;
  pronouns: string;
  id: number;
}

export type PublicItemSafe = Pick<
  Item,
  'name' | 'description' | 'id' | 'owner_id'
>;

export interface Session {
  user_safe: PrivateUserSafe;
  session_stay: boolean;
  session_end: number;
}

export type BorrowRequest = InferModel<typeof borrow_requests>;

export type Item = InferModel<typeof items>;

export interface Offer {
  user: PublicUserSafe;
  item: PublicItemSafe;
  borrow_request: BorrowRequest | null;
}

export interface NotificationBorrowRequest {
  user: PublicUserSafe;
  item: PublicItemSafe;
  borrow_request: BorrowRequest;
}

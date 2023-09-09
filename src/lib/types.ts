import type { InferModel } from 'drizzle-orm';
import type { borrow_requests, community_messages, items, notifications, request_actions, users } from './server/db/schema';

export interface UserRegister {
  full_name: string;
  user_name: string;
  password: string;
  email: string;
  pronouns: string;
}

export type PublicItemSafe = Pick<
  Item,
  'name' | 'description' | 'id' | 'owner_id' | 'image_src' | 'offered'
>;

export interface Session {
  user_safe: PrivateUserSafe;
  session_stay: boolean;
}

export type BorrowRequest = InferModel<typeof borrow_requests>;

export type Item = InferModel<typeof items>;

export type User = InferModel<typeof users>;


export type PrivateUserSafe = Pick<
User,
  'user_name' | 'email' | 'id' | 'full_name' | 'pronouns' | 'bio' | 'role'
>;

export type PublicUserSafe = Pick<
User,
  'user_name' | 'id' | 'pronouns' | 'bio' | 'full_name'
>;

export type CommunityMessage = InferModel<typeof community_messages>;

export type RequestAction = InferModel <typeof request_actions>;

export type Notification = InferModel <typeof notifications>;

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

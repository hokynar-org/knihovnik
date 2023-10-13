import type { InferModel } from 'drizzle-orm';
import type {
  borrow_requests,
  communities,
  community_messages,
  items,
  notifications,
  request_actions,
  user_community_relations,
  users,
} from './server/db/schema';

export interface UserRegister {
  full_name: string;
  user_name: string;
  password: string;
  email: string;
  pronouns: string;
}

export type PublicItemSafe = Pick<
  Item,
  'name' | 'description' | 'id' | 'owner_id' | 'image_src' | 'offered' | 'hasMainPic' | 'iconName'
>;

export interface Session {
  user_safe: PrivateUserSafe;
  session_stay: boolean;
}

export type BorrowRequest = InferModel<typeof borrow_requests>;

export type Item = InferModel<typeof items>;

export type User = InferModel<typeof users>;

export type Community = InferModel<typeof communities>;

export type CommunityRelation = InferModel<typeof user_community_relations>;

export type PrivateUserSafe = Pick<
  User,
  'user_name' | 'email' | 'id' | 'full_name' | 'pronouns' | 'bio' | 'role'
>;

export type PublicUserSafe = Pick<
  User,
  'user_name' | 'id' | 'pronouns' | 'bio' | 'full_name'
>;

export type CommunityMessage = {
  id: number;
  timestamp: Date | null;
  community_id: number;
  user_id: number;
  message: string | null;
  user_name: string;
};

export type RequestAction = InferModel<typeof request_actions>;

export type RequestActionMessage = {
  id: number;
  message: string | null;
  type: string;
  user_id: number;
  timestamp: Date | null;
  borrow_request_id: number;
  user_name: string;
};

export type Notification = InferModel<typeof notifications>;

export interface Offer {
  item: PublicItemSafe;
  owner: PublicUserSafe;
}

export interface NotificationBorrowRequest {
  user: PublicUserSafe;
  item: PublicItemSafe;
  borrow_request: BorrowRequest;
}

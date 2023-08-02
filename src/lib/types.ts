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
  password_hash: string;
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

export interface PublicItemSafe {
  name: string;
  description: string;
  id: number;
  user_id: number;
}

export interface Session {
  user_safe: PrivateUserSafe;
  session_stay: boolean;
  session_end: number;
}

export interface BorrowRequest {
  id: number,
  item_id: number,
  lender_id: number,
  borrower_id: number,
  status: string,
  timestamp: number,
}

export interface Item {
  id: number,
  name: string,
  description: string,
  image_src: string,
  owner_id: number,
  holder_id: number,
}

export interface Offer {
  user:PublicUserSafe,
  item:PublicItemSafe,
  borrow_request:BorrowRequest | null,
}

export interface NotificationBorrowRequest {
  user: PublicUserSafe,
  item: PublicItemSafe,
  borrow_request: BorrowRequest,
}
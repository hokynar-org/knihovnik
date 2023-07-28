export interface Community {
  id: Number;
  dateCreated: Date;
  communityName: string;
  communityDescription: string;
  users: User[];
}

export interface User {
  id: number;
  full_name: string
  user_name: string;
  password_hash: string;
  email: string;
  pronouns: string;
  role:string;
}

export interface UserRegister {
  full_name: string
  user_name: string;
  password: string;
  email: string;
  pronouns: string;
}

export interface PrivateUserSafe {
  id: number;
  full_name: string
  user_name: string;
  email: string;
  pronouns: string;
  role:string;
}

export interface PublicUserSafe {
  user_name: string;
  full_name: string;
  id: number;
}

export interface PublicItemSafe {
  name: string;
  description: string;
  id: number;
  user_id: number;
}

export interface Session {
  user_safe: PrivateUserSafe,
  session_stay: boolean,
  session_end: number,
}
import type { U } from "drizzle-orm/column.d-66a08b85";

export interface Community {
    id: Number;
    dateCreated: Date;
    communityName: string;
    communityDescription: string;
    users: User[];
}

export interface User {
    id: Number;
    dateCreated: Date;
    username: string;
    password: string;
    email: string;
    communities: Community[];
}


export interface PublicUserSafe {
    user_name: string
    full_name: string
    id: number
}
  
export interface PublicItemSafe{
    name: string
    description: string
    id:number
    user_id:number
}
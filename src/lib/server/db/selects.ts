import { borrow_requests, items, users } from "./schema"
import { alias } from "drizzle-orm/pg-core";

export const holders= alias(users,'holders');
export const owners = alias(users,'owners');
export const borrowers = alias(users,'borrowers');
export const lenders = alias(users,'lenders');

export const user_select = {
    id: users.id,
    full_name: users.full_name,
    user_name: users.user_name,
    pronouns: users.pronouns,
};

export const holder_select = {
    id: holders.id,
    full_name: holders.full_name,
    user_name: holders.user_name,
    pronouns: holders.pronouns,
};

export const owner_select = {
    id: owners.id,
    full_name: owners.full_name,
    user_name: owners.user_name,
    pronouns: owners.pronouns,
};

export const borrower_select = {
    id: borrowers.id,
    full_name: borrowers.full_name,
    user_name: borrowers.user_name,
    pronouns: borrowers.pronouns,
};

export const lender_select = {
    id: lenders.id,
    full_name: lenders.full_name,
    user_name: lenders.user_name,
    pronouns: lenders.pronouns,
};

export const item_select={
    name: items.name,
    description: items.description,
    id: items.id,
    owner_id: items.owner_id,
    holder_id: items.holder_id,
    image_src: items.image_src,
    offered: items.offered,
};

export const borrow_request_select={
    status: borrow_requests.status,
    id: borrow_requests.id,
    borrower_id: borrow_requests.borrower_id,
    lender_id: borrow_requests.lender_id,
    item_id: borrow_requests.item_id,
    timestamp: borrow_requests.timestamp,
};
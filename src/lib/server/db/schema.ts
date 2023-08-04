import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  full_name: text('full_name').notNull(),
  user_name: text('user_name').notNull().unique(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  pronouns: text('pronouns').notNull(),
  password_hash: text('password_hash').notNull(),
  role: text('role').default('USER').notNull(),
  confirm_hash: text('confirm_hash'),
});

export const items = pgTable('items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  image_src: text('image_src'),
  owner_id: integer('owner_id')
    .references(() => users.id)
    .notNull(),
  holder_id: integer('holder_id')
    .references(() => users.id)
    .notNull(),
});

export const borrow_requests = pgTable('borrow_requests', {
  id: serial('id').primaryKey(),
  item_id: integer('item_id').references(() => items.id),
  lender_id: integer('lender_id').references(() => users.id),
  borrower_id: integer('borrower_id').references(() => users.id),
  status: text('status').default('PENDING'),
  timestamp: timestamp('timestamp').defaultNow(),
});

export const community = pgTable('community', {
  id: serial('id').primaryKey(),
  name: text('name'),
  description: text('description'),
});

export const item_visibility = pgTable('item_visibility', {
  item_id: integer('item_id').references(() => items.id),
  community_id: integer('community_id').references(() => community.id),
});

/* eslint-disable camelcase */
import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  full_name: text('full_name').notNull(),
  user_name: text('user_name').notNull().unique(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  pronouns: text('pronouns').notNull(),
  password_hash: text('password_hash').notNull(),
  role: text('role').default('USER').notNull(),
  confirm_hash: text('confirm_hash'),
  bio: text('bio'),
});

export const items = pgTable('items', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  image_src: text('image_src'),
  owner_id: uuid('owner_id')
    .references(() => users.id)
    .notNull(),
  holder_id: uuid('holder_id')
    .references(() => users.id)
    .notNull(),
  offered: boolean('offered').default(true).notNull(),
  hasMainPic: boolean('hasMainPic').default(true).notNull(),
  iconName: text('iconName'),
  transfeType: text('transfeType').notNull().default('BORROW'),
});

export const borrow_requests = pgTable('borrow_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  item_id: uuid('item_id')
    .references(() => items.id)
    .notNull(),
  lender_id: uuid('lender_id')
    .references(() => users.id)
    .notNull(),
  borrower_id: uuid('borrower_id')
    .references(() => users.id)
    .notNull(),
  status: text('status').default('PENDING'),
  timestamp: timestamp('timestamp').defaultNow(),
});

export const request_actions = pgTable('request_actions', {
  id: uuid('id').defaultRandom().primaryKey(),
  borrow_request_id: uuid('borrow_request_id')
    .references(() => borrow_requests.id)
    .notNull(),
  user_id: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  type: text('type').notNull(),
  message: text('message'),
  timestamp: timestamp('timestamp').defaultNow(),
});

export const communities = pgTable('communities', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  visibility: boolean('visibility').default(false).notNull(),
});

export const user_community_relations = pgTable('user_community_relations', {
  user_id: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  community_id: uuid('community_id')
    .references(() => communities.id)
    .notNull(),
  role: text('role').default('MEMBER'),
  timestamp: timestamp('timestamp').defaultNow(),
});

export const item_visibility = pgTable('item_visibility', {
  item_id: uuid('item_id').references(() => items.id),
  community_id: uuid('community_id').references(() => communities.id),
});

export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  text: text('text'),
  url: text('url'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  read: boolean('read').default(false).notNull(),
});

export const community_messages = pgTable('community_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  community_id: uuid('community_id')
    .references(() => communities.id)
    .notNull(),
  user_id: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  message: text('message'),
  timestamp: timestamp('timestamp').defaultNow(),
});

export const reset_tokens = pgTable('reset_tokens', {
  hash: text('id').primaryKey(),
  user_id: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  type: text('type').notNull(),

  timestamp: timestamp('timestamp').defaultNow(),
  expires: timestamp('expires'),
});

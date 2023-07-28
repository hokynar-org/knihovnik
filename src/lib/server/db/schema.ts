import {
  pgTable,
  serial,
  text,
  varchar,
  uuid,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  full_name: text("full_name"),
  user_name: text("user_name"),
  email: varchar("email", { length: 256 }),
  pronouns: text("pronouns"),
  password_hash: text("password_hash"),
  role: text("role").default("USER"),
});

export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  image_src: text('image_src'),
  owner_id: integer("owner_id").references(() => users.id),
  holder_id: integer("holder_id").references(() => users.id),
});

export const borrow_request = pgTable("borrow_request", {
  item_id: integer("item_id").references(() => items.id),
  lender_id: integer("lender_id").references(() => users.id),
  borrower_id: integer("borrower_id").references(() => users.id),
  status: text("status").default("PENDING"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const community = pgTable("community",{
  id: serial("id").primaryKey(),
  name: text("name"),
  description: text("description"),
});

export const item_visibility = pgTable("item_visibility",{
  item_id: integer("item_id").references(() => items.id),
  community_id: integer("community_id").references(() => community.id),
});
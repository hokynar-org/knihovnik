import { pgTable, serial, text, varchar, uuid, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  full_name: text("full_name"),
  user_name: text("user_name"),
  email: varchar("email", { length: 256 }),
  pronouns: text("pronouns"),
  password_hash: text("password_hash"),
});

export const sessions = pgTable("sessions",{
  auth_token:uuid("auth_token").primaryKey(),
  user_id: integer('user_id').references(() => users.id)
})
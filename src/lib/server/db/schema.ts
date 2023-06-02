import { pgTable, serial, text, varchar, uuid  } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  full_name: text("full_name"),
  user_name: text("user_name"),
  email: varchar("email", { length: 256 }),
  pronouns: text("pronouns"),
  password_hash: text("password_hash"),
  auth_token: uuid("auth_token"),
});

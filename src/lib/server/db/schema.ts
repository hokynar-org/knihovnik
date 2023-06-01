import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
 
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  phone: varchar('phone', { length: 256 }),
});

// export const users = pgTable('users', {
  //   id: serial('id').primaryKey(),
  //   full_name: text('full_name'),
  //   user_name: text('user_name'),
  //   email: varchar('email', { length: 256 }),
  //   pronouns: text('pronouns'),
  // });
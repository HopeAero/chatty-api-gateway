import { pgTable, text } from "drizzle-orm/pg-core";


export const users = pgTable(
    'users',
    {
      username: text('username').primaryKey(),
      password: text('password').notNull(),
    },
);

export type User = typeof users.$inferInsert;
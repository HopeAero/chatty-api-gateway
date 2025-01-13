import { pgTable, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  username: text().primaryKey(),
});

export type User = typeof users.$inferSelect;

import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { authMethods } from "./auth-methods.schema";

export const localAuth = pgTable("local_auth", {
  id: integer()
    .primaryKey()
    .references(() => authMethods.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  password: text().notNull(),
});

export type LocalAuth = typeof localAuth.$inferSelect;

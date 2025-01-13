import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { authMethods } from "./auth-methods.schema";

export const googleAuth = pgTable("google_auth", {
  id: integer()
    .primaryKey()
    .references(() => authMethods.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  email: text().notNull().unique(),
});

export type GoogleAuth = typeof googleAuth.$inferSelect;

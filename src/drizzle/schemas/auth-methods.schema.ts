import { integer, pgEnum, pgTable, text, unique } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const authMethodType = ["local", "google"] as const;
export const authMethodTypeEnum = pgEnum("auth_method_type", authMethodType);

export const authMethods = pgTable(
  "auth_methods",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userUsername: text("user_username")
      .notNull()
      .references(() => users.username, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    type: authMethodTypeEnum().notNull(),
  },
  (t) => ({
    userUsernameTypeUnique: unique().on(t.userUsername, t.type),
  }),
);

export type AuthMethod = typeof authMethods.$inferSelect;
export type AuthMethodType = (typeof authMethodType)[number];

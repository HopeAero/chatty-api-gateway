import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/drizzle/schemas/index.ts",
  out: "./drizzle-kit",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_URL,
  },
});
import { Module } from "@nestjs/common";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { envs } from "src/config";

export const DRIZZLE_TOKEN = Symbol("drizzle-connection");

@Module({
  providers: [
    {
      provide: DRIZZLE_TOKEN,
      useFactory: async () => {
        const pool = new Pool({
          connectionString: envs.DB_URL,
        });
        return drizzle(pool, { logger: true });
      },
    },
  ],
  exports: [DRIZZLE_TOKEN],
})
export class DrizzleModule {}

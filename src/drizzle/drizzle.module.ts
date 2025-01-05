import { Module } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { envs } from 'src/config';
import * as schema from './schema';
export const DRIZZLE = Symbol('drizzle-connection');
@Module({
  providers: [
    {
      provide: DRIZZLE,
      useFactory: async () => {
        const pool = new Pool({
          connectionString: envs.DB_URL,
        });
        return drizzle(pool, { schema, logger: true }) as NodePgDatabase<typeof schema>;
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
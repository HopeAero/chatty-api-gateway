import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default({
  schema: 'drizzle-kit/index.js',
  out: './drizzle-kit',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL,
  },
})satisfies Config;
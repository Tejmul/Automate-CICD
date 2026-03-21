import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// CI runs `prisma migrate deploy` without a .env — env() would throw if unset.
const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: databaseUrl,
  },
});

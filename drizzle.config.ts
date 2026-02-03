import { schema } from 'db/schema';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './db/schema.ts',
  out: './db/migrations',
  dbCredentials: {
    url: 'postgres://hwapp:pakacnu@192.168.0.101/hw',
  },
  schemaFilter: [schema.schemaName],
  verbose: true,
  strict: true,
});

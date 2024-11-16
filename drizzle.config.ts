import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'postgresql',
	schema: './db/schema.ts',
	out: './db/migrations',
	dbCredentials: {
		url: 'postgres://hwapp:pakacnu@192.168.0.101/hw',
	},
	verbose: true,
	strict: true,
});

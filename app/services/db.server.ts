import { drizzle } from 'drizzle-orm/connect';

export const db = await drizzle("postgres-js", process.env.DATABASE_URL!)
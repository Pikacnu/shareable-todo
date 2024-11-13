import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const queryClient = postgres(process.env.DATABASE_URL!,{
  password: process.env.DATABASE_PASSWORD,
});
export const db = drizzle(queryClient);
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../db.server';
import { redirect } from 'react-router';
import * as schema from '@/db/schema';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:5173',
  secret:
    process.env.BETTER_AUTH_SECRET ||
    'your-secret-key-change-this-in-production',
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      redirectURI: `${process.env.BETTER_AUTH_URL || 'http://localhost:5173'}/api/auth/callback/discord`,
    },
  },
});

export type Session = typeof auth.$Infer.Session;

export async function getSession(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  return session;
}

export async function isAuthenticated(
  request: Request,
  options?: {
    successRedirect?: string;
    failureRedirect?: string;
  },
) {
  const session = await getSession(request);

  if (!session) {
    if (options?.failureRedirect) {
      throw redirect(options.failureRedirect);
    }
    return null;
  }

  if (options?.successRedirect) {
    throw redirect(options.successRedirect);
  }

  return session;
}

export async function logout(request: Request) {
  await auth.api.signOut({
    headers: request.headers,
  });

  return redirect('/login');
}

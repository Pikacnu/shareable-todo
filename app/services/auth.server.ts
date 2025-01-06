import { Authenticator } from 'remix-auth';
import { sessionStorage } from './session.server';
import { DiscordStrategy } from 'remix-auth-discord';
import { AuthType, UserData } from './auth.type';
import { db } from './db.server';
import { user } from 'db/schema';
import { eq } from 'drizzle-orm';

export const authenticator = new Authenticator<UserData>(sessionStorage);

const callbackURL = (providor: AuthType) =>
  `${process.env.URL}/auth/${providor}/callback`;

authenticator.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      callbackURL: callbackURL(AuthType.Discord)!,
      scope: ['identify', 'email'],
    },
    async (profile) => {
      const userData: UserData = {
        name: profile.profile.displayName,
        email: profile.profile.emails![0].value,
      };
      if (
        (await db.select().from(user).where(eq(user.email, userData.email)))
          .length > 0
      )
        return userData;
      await db
        .insert(user)
        .values({
          email: profile.profile.emails![0].value,
          name: profile.profile.displayName,
        })
        .returning({
          id: user.id,
          name: user.name,
        })
        .onConflictDoNothing();
      return userData;
    },
  ),
);

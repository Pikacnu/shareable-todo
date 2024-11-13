import { Authenticator } from 'remix-auth';
import { sessionStorage } from './session.server';
import { DiscordStrategy } from 'remix-auth-discord';
import { AuthType } from './auth.type';

export const authenticator = new Authenticator(sessionStorage);

const callbackURL = (providor: AuthType) => `${process.env.URL}/auth/${providor}/callback`;

authenticator.use(
	new DiscordStrategy(
		{
			clientID: process.env.DISCORD_CLIENT_ID!,
			clientSecret: process.env.DISCORD_CLIENT_SECRET!,
			callbackURL: callbackURL(AuthType.Discord)!,
			scope: ['identify', 'email'],
		},
		async (profile) => {
			const user = {
				name: profile.profile.name,
				email: profile.profile.emails![0].value,
			};
			return user;
		},
	),
);

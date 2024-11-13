import { Authenticator } from 'remix-auth';
import { sessionStorage } from './session.server';
import { DiscordStrategy } from 'remix-auth-discord';
import { AuthType,UserData } from './auth.type';

export const authenticator = new Authenticator<UserData>(sessionStorage);

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
			const user:UserData = {
				name: profile.profile.displayName,
				email: profile.profile.emails![0].value,
			};
			return user;
		},
	),
);

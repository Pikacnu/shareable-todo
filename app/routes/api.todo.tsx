import { ActionFunctionArgs } from '@remix-run/node';
import { user } from 'db/schema';
import { eq } from 'drizzle-orm';
import { authenticator } from '~/services/auth.server';
import { db } from '~/services/db.server';

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = (await request.formData()).entries();
	let data = {};
	for (const [key, value] of formData) {
		data = { ...data, [key]: value };
	}
	const userData = await authenticator.isAuthenticated(request);
	const userInfoFromDB = await db.select().from(user).where(eq(user.email, userData?.email||''));
	console.log(userData,data,userInfoFromDB);
	return null
};

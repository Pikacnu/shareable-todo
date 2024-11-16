import { ActionFunctionArgs } from '@remix-run/node';
import { user } from 'db/schema';
import { eq } from 'drizzle-orm';
import { authenticator } from '~/services/auth.server';
import { db } from '~/services/db.server';

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();
	const title = formData.get('title');
	const description = formData.get('description');
	const isToday = formData.get('isToday');
	const startDatetime = formData.get('startDatetime');
	const endDatetime = formData.get('endDatetime');
	const selectedItems = formData.getAll('selectedItems');
	const data = {
		title,
		description,
		isToday,
		startDatetime,
		endDatetime,
		selectedItems,
	};
	const userData = await authenticator.isAuthenticated(request);
	const userInfoFromDB = await db
		.select()
		.from(user)
		.where(eq(user.email, userData?.email || ''));
	console.log(userData, data, userInfoFromDB);
	return null;
};

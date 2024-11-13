import { ActionFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();
	const title = formData.get('title');
	const test = authenticator.isAuthenticated(request);
	console.log(test, formData,title);
};

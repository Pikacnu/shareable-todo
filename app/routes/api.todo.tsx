import { ActionFunctionArgs } from '@remix-run/node';
import { POST, DELETE } from '~/api/todo.server';

export const action = async ({ request }: ActionFunctionArgs) => {
	switch (request.method) {
		case 'POST':
			return POST(request);
		case 'DELETE':
			return DELETE(request);
		default:
			return new Response('Method Not Allowed', { status: 405 });
	}
};

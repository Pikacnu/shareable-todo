import { LoaderFunctionArgs } from '@remix-run/node';
import { list, user } from 'db/schema';
import { eq } from 'drizzle-orm';
import { getUserDataByRequest } from '~/function/getUserData';
import { db } from '~/services/db.server';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const id = parseInt(params.id || '');
	if (id === undefined || isNaN(id)) {
		return new Response('Not Found', { status: 404 });
	}
	try {
		const userData = await getUserDataByRequest(request);
		if (userData === null) {
			return new Response('Unauthorized', { status: 401 });
		}
		const todolist = (await db.select().from(list).where(eq(list.id, id)))[0];
		let isOwner = false;
		if (todolist.owner_id !== userData.id) isOwner = true;
		let ownerName;
		if (!isOwner) {
			ownerName = (
				await db
					.select({ username: user.name })
					.from(user)
					.where(eq(user.id, todolist.owner_id))
			)[0].username;
		}
		return {
			user: {
				username: user.name,
			},
			isOwner: isOwner,
			owner: ownerName || '',
			todolist: {
				title: todolist.title,
				description: todolist.description,
			},
		};
	} catch (e) {
		console.error(e);
		return new Response('Internal Server Error', { status: 500 });
	}
};

export default function ShareTo() {
	const { user, isOwner, ownerName, todolist } = useLoaderData<typeof loader>();
	return (
		<div>
			<h1>
				{isOwner ? 'Owner' : ownerName} Share {todolist.title} to{' '}
				{user.username}
			</h1>
      <button>
        Add TodoList
      </button>
		</div>
	);
}

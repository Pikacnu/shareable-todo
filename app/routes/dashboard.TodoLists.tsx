import { DropList } from '~/componments/tododroplist';
import { user } from 'db/schema';
import { eq } from 'drizzle-orm';
import { LoaderFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import { db } from '~/services/db.server';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { useRef } from 'react';
import { getTodoLists } from '~/function/getUserData';

export const loader = async ({ request }: LoaderFunctionArgs) => {
	try {
		const userData = await authenticator.isAuthenticated(request);
		const userInfoFromDB = (
			await db
				.select()
				.from(user)
				.where(eq(user.email, userData?.email || ''))
		)[0];
		const todoLists = await getTodoLists(userInfoFromDB.id);
		return {
			todolists: todoLists,
		};
	} catch (e) {
		console.log(e);
		return {
			todolists: [],
		};
	}
};

export default function TodoLists() {
	const { todolists } = useLoaderData<typeof loader>();
	const Fetcher = useFetcher();
	const title = useRef<HTMLInputElement>(null);
	const description = useRef<HTMLInputElement>(null);
	return (
		<div className='w-full h-full '>
			<DropList todoList={todolists} />
			<div className='flex m-4'>
				<div className='flex bg-slate-700 *:p-2 *:max-w-[20%] flex-grow'>
					<input
						type='text'
						className='text-xl'
						placeholder='title'
						ref={title}
					/>
					<input
						type='text'
						className='text-xl'
						placeholder='description'
						ref={description}
					/>
				</div>
				<button
					className='p-2 w-32 bg-green-600'
					onClick={() => {
						const formData = new FormData();
						if (!title.current?.value) return alert('title is required');
						formData.append('title', title.current?.value || '');
						formData.append('description', description.current?.value || '');
						Fetcher.submit(formData, {
							action: '/api/todolist',
							method: 'POST',
						});
					}}
				>
					add
				</button>
			</div>
		</div>
	);
}

import { DropList, ShareStatus, TodoList } from '~/componments/tododroplist';
import { LoaderFunctionArgs } from '@remix-run/node';
import { user, list } from 'db/schema';
import { authenticator } from '~/services/auth.server';
import { db } from '~/services/db.server';
import { eq } from 'drizzle-orm';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const userData = await authenticator.isAuthenticated(request);
	const userInfoFromDB = (
		await db
			.select()
			.from(user)
			.where(eq(user.email, userData?.email || ''))
	)[0];
	const todos = (
		await db.select().from(list).where(eq(list.owner_id, userInfoFromDB.id))
	);
	
	return {
		
	};
};

export default function TodoLists() {
	const { todolist } = useLoaderData<typeof loader>();
	return (
		<div className='w-full h-full '>
			<DropList/>
			<div className='flex m-4'>
				<div className='flex bg-slate-700 *:p-2 *:max-w-[20%] flex-grow'>
					<input
						type='text'
						className='text-xl'
						placeholder='title'
					/>
					<input
						type='text'
						className='text-xl'
						placeholder='description'
					/>
				</div>
				<button className='p-2 w-32 bg-green-600'>add</button>
			</div>
		</div>
	);
}

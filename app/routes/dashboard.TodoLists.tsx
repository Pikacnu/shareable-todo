import { DropList, ShareStatus, TodoListWithOwnerInfo } from '~/componments/tododroplist';
import { LoaderFunctionArgs } from '@remix-run/node';
import { user, list, event, todoListLinkToEvent } from 'db/schema';
import { authenticator } from '~/services/auth.server';
import { db } from '~/services/db.server';
import { eq, arrayOverlaps, or } from 'drizzle-orm';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { useRef } from 'react';

export const loader = async ({ request }: LoaderFunctionArgs) => {
	try {
		const userData = await authenticator.isAuthenticated(request);
		const userInfoFromDB = (
			await db
				.select()
				.from(user)
				.where(eq(user.email, userData?.email || ''))
		)[0];
		const todoListsData = await db
			.select()
			.from(list)
			.where(
				or(
					eq(list.owner_id, userInfoFromDB.id),
					arrayOverlaps(list.shareWith, [userInfoFromDB.id]),
				),
			)
			.leftJoin(todoListLinkToEvent, eq(list.id, todoListLinkToEvent.list_id))
			.leftJoin(event, eq(todoListLinkToEvent.event_id, event.id));
		const todoLists: TodoListWithOwnerInfo[] = todoListsData.reduce(
			(acc: TodoListWithOwnerInfo[], todoListData: (typeof todoListsData)[0]) => {
				if (
					acc.some((accTodoList) => accTodoList.id === todoListData.list.id)
				) {
					acc
						.find((accTodoList) => accTodoList.id === todoListData.list.id)
						?.Todo.push({
							id: todoListData.event?.id || 0,
							title: todoListData.event?.title || '',
							description: todoListData.event?.description || '',
							isToday:
								new Date(todoListData.event?.start_date || 0).toDateString() ===
								new Date(todoListData.event?.end_date || 0).toDateString(),
							datetime: (
								todoListData.event?.start_date || new Date()
							).toISOString(),
							finished: false,
						});
				} else {
					acc.push({
						id: todoListData.list.id,
						title: todoListData.list.title,
						Todo: [],
						isOwner: todoListData.list.owner_id === userInfoFromDB.id,
						shareStatus: todoListData.list.shareStatus as ShareStatus,
					});
				}
				return acc;
			},
			[],
		);
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

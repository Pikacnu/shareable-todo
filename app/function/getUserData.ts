import { ShareStatus, TodoListWithListInfo } from '~/componments/tododroplist';
import { user, list, event, todoListLinkToEvent, ShareID } from 'db/schema';
import { eq, arrayOverlaps, or } from 'drizzle-orm';
import { db } from '~/services/db.server';
import { authenticator } from '~/services/auth.server';

export const getTodoLists = async (userID: number) => {
	const todoListsData = await db
		.select()
		.from(list)
		.where(
			or(eq(list.owner_id, userID), arrayOverlaps(list.shareWith, [userID])),
		)
		.leftJoin(todoListLinkToEvent, eq(list.id, todoListLinkToEvent.list_id))
		.leftJoin(event, eq(todoListLinkToEvent.event_id, event.id))
		.leftJoin(ShareID, eq(list.id, ShareID.list_id));
	const todoLists: TodoListWithListInfo[] = todoListsData.reduce(
		(acc: TodoListWithListInfo[], todoListData: (typeof todoListsData)[0]) => {
			if (acc.some((accTodoList) => accTodoList.id === todoListData.list.id)) {
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
					shareId: todoListData.ShareID?.share_id || '',
					Todo: todoListData.event
						? [
								{
									id: todoListData.event?.id || 0,
									title: todoListData.event?.title || '',
									description: todoListData.event?.description || '',
									isToday:
										new Date(
											todoListData.event?.start_date || 0,
										).toDateString() ===
										new Date(todoListData.event?.end_date || 0).toDateString(),
									datetime: (
										todoListData.event?.start_date || new Date()
									).toISOString(),
									finished: false,
								},
								// eslint-disable-next-line no-mixed-spaces-and-tabs
						  ]
						: [],
					isOwner: todoListData.list.owner_id === userID,
					shareStatus: todoListData.list.shareStatus as ShareStatus,
				});
			}
			return acc;
		},
		[],
	);
	return todoLists;
};

export const getUserData = async (email: string) =>
	(
		await db
			.select()
			.from(user)
			.where(eq(user.email, email || ''))
	)[0];

export const getUserDataByRequest = async (request: Request) => {
	const userData = await authenticator.isAuthenticated(request);
	return await getUserData(userData?.email || '');
};
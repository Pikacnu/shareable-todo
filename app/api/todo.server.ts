import { event, user, todoListLinkToEvent } from 'db/schema';
import { eq } from 'drizzle-orm';
import { authenticator } from '~/services/auth.server';
import { db } from '~/services/db.server';

export const POST = async (request: Request) => {
	try {
		const formData = await request.formData();
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const isToday = formData.get('isToday') === 'true' ? true : false;
		const startDatetime = new Date(formData.get('startDatetime') as string);
		const endDatetime = new Date(formData.get('endDatetime') as string);
		const selectedTodoListsIDs = (formData.get('selectedTodoLists') as string)
			.split(',')
			.map((id) => parseInt(id));
		if (title === '')
			return new Response("Title can't be blank", { status: 400 });
		const userData = await authenticator.isAuthenticated(request);
		const userInfoFromDB = await db
			.select()
			.from(user)
			.where(eq(user.email, userData?.email || ''));
		if (!userInfoFromDB.length)
			return new Response('User not found', { status: 400 });
		const userID = userInfoFromDB[0].id;

		const newEvent = (
			await db
				.insert(event)
				.values({
					title: title,
					description: description,
					is_long_time: !isToday,
					start_date: startDatetime,
					end_date: endDatetime,
					creater_id: userID,
				})
				.returning({
					id: event.id,
				})
		)[0];
		await Promise.all(
			selectedTodoListsIDs.map(async (id) => {
				await db.insert(todoListLinkToEvent).values({
					list_id: id,
					event_id: newEvent.id,
				});
			}),
		);
		return new Response('OK', { status: 200 });
	} catch (e) {
		console.error(e);
		return new Response('Internal Server Error', { status: 500 });
	}
};

export const DELETE = async (request: Request) => {
	try {
		const formData = await request.formData();
		const eventID = parseInt(formData.get('id') as string);
		const userData = await authenticator.isAuthenticated(request);
		const userInfoFromDB = await db
			.select()
			.from(user)
			.where(eq(user.email, userData?.email || ''));
		if (!userInfoFromDB.length)
			return new Response('User not found', { status: 400 });
		const userID = userInfoFromDB[0].id;
		const eventInfo = (
			await db.select().from(event).where(eq(event.id, eventID))
		)[0];
		if (!eventInfo) return new Response('Event not found', { status: 400 });
		if (eventInfo.creater_id !== userID)
			return new Response('Unauthorized', { status: 401 });
		//await db.delete(todoListLinkToEvent).where(eq(todoListLinkToEvent.event_id, eventID));
		await db.delete(event).where(eq(event.id, eventID));
		return new Response('OK', { status: 200 });
	} catch (e) {
		console.error(e);
		return new Response('Internal Server Error', { status: 500 });
	}
};

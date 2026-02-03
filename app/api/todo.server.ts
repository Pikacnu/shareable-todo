import { event, user, todoListLinkToEvent } from 'db/schema';
import { eq } from 'drizzle-orm';
import { isAuthenticated } from '~/services/auth/auth.server';
import { db } from '~/services/db.server';

enum LoopDuration {
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly',
  yearly = 'yearly',
}

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
    const loop = (formData.get('loop') as string) === 'true' ? true : false;
    const loopDurationKey = (formData.get('loopDuration') as string) || 'daily';
    const loopDuration =
      LoopDuration[loopDurationKey as keyof typeof LoopDuration];

    if (title === '')
      return new Response("Title can't be blank", { status: 400 });

    if (!isToday && loop) {
      if (!loopDuration) {
        return new Response('Loop duration is not valid', { status: 400 });
      }
      const startTime = new Date(startDatetime.toISOString().slice(0, 10));
      const endTime = new Date(endDatetime.toISOString().slice(0, 10));
      switch (loopDuration) {
        case 'daily': {
          if (endTime.getTime() - startTime.getTime() < 24 * 60 * 60 * 1000) {
            return new Response('End time should be less than 24 hours', {
              status: 400,
            });
          }
          break;
        }
        case 'weekly': {
          if (
            endTime.getTime() - startTime.getTime() >
            7 * 24 * 60 * 60 * 1000
          ) {
            return new Response('End time should be less than 7 days', {
              status: 400,
            });
          }
          break;
        }
        case 'monthly': {
          if (
            endTime.getTime() - startTime.getTime() >
            30 * 24 * 60 * 60 * 1000
          ) {
            return new Response('End time should be less than 30 days', {
              status: 400,
            });
          }
          break;
        }
        case 'yearly': {
          if (
            endTime.getTime() - startTime.getTime() >
            365 * 24 * 60 * 60 * 1000
          ) {
            return new Response('End time should be less than 365 days', {
              status: 400,
            });
          }
          break;
        }
      }
    }

    const userData = await isAuthenticated(request);
    const userInfoFromDB = await db
      .select()
      .from(user)
      .where(eq(user.email, userData?.user?.email || ''));
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
          loop: loop,
          loop_duration: loopDuration,
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
    const userData = await isAuthenticated(request);
    const userInfoFromDB = await db
      .select()
      .from(user)
      .where(eq(user.email, userData?.user?.email || ''));
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

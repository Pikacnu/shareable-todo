import { ActionFunctionArgs } from '@remix-run/node';
import { getUserDataByRequest, UserData } from '~/function/getUserData';
import { generateChange } from '~/services/gemini.server';
import { db } from '~/services/db.server';
import { chatSession, event, list, todoListLinkToEvent } from 'db/schema';
import { arrayOverlaps, eq, or } from 'drizzle-orm';

function objectToCSVLikeString(obj: object): string {
  return Object.entries(obj)
    .map(([key, value]) => {
      if (typeof value === 'object') {
        return objectToCSVLikeString(value);
      }
      return `${key}:${value}`;
    })
    .join(',');
}

const POST = async (request: Request, userData: UserData) => {
  const history = (
    await db
      .select({
        history: chatSession.history,
        count: chatSession.count,
      })
      .from(chatSession)
      .where(eq(chatSession.user_id, userData.id))
  )[0];

  if (history.count === 0) {
    return new Response(
      JSON.stringify({
        error: 'Out of available chat',
      }),
      { status: 400 },
    );
  }

  const todos = await db
    .select({
      title: event.title,
      description: event.description,
      start_date: event.start_date,
      end_date: event.end_date,
      repeat: event.loop,
      repeat_duration: event.loop_duration,
      list_id: todoListLinkToEvent.list_id,
    })
    .from(list)
    .where(
      or(
        eq(list.owner_id, userData.id),
        arrayOverlaps(list.shareWith, [userData.id]),
      ),
    )
    .rightJoin(todoListLinkToEvent, eq(list.id, todoListLinkToEvent.list_id))
    .rightJoin(event, eq(todoListLinkToEvent.event_id, event.id));
  const todolists = await db
    .select({
      title: list.title,
      description: list.description,
      list_id: list.id,
    })
    .from(list)
    .where(
      or(
        eq(list.owner_id, userData.id),
        arrayOverlaps(list.shareWith, [userData.id]),
      ),
    );
  const todosCSV = todos
    .map((todo) => {
      return Object.assign(todo, {
        start_date: new Date(todo.start_date!).toISOString(),
        end_date: new Date(todo.end_date!).toISOString(),
      });
    })
    .map(objectToCSVLikeString)
    .join('\n');
  const todolistsCSV = todolists.map(objectToCSVLikeString).join('\n');
  const data = await request.json();
  const { text } = data;
  const change = await generateChange(text, {
    todos: todosCSV,
    todolists: todolistsCSV,
  });

  if (change.error) {
    return new Response(JSON.stringify(change.error), { status: 400 });
  }

  const currentChat = {
    todoListChanges: change['change-todo-lists'],
    todoChanges: change['change-events'],
    texts: [
      {
        text: text,
        role: 'User',
      },
      {
        text: change.response,
        role: 'System',
      },
    ],
  };

  if (!history.history) {
    await db.insert(chatSession).values({
      user_id: userData.id,
      history: [change],
    });
    return new Response(JSON.stringify(change), { status: 200 });
  }
  await db.update(chatSession).set({
    history: history.history.concat([JSON.stringify(currentChat)]),
    count: history.count! - 1,
  });

  return new Response(JSON.stringify(change), { status: 200 });
};

const DELETE = async (request: Request, userData: UserData) => {
  await db.delete(chatSession).where(eq(chatSession.user_id, userData.id));
  return new Response('OK', { status: 200 });
};

const PUT = async () => {
  return new Response('Not Implemented', { status: 501 });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userData = await getUserDataByRequest(request);
  if (!userData) {
    return new Response('Unauthorized', { status: 401 });
  }
  if (request.method === 'POST') {
    return POST(request, userData);
  }
  if (request.method === 'DELETE') {
    return DELETE(request, userData);
  }
  if (request.method === 'PUT') {
    console.log('PUT');
    return PUT();
  }
};

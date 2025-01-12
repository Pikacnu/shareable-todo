import { UserData } from '~/function/getUserData';
import { generateChange } from '~/services/gemini.server';
import { db } from '~/services/db.server';
import { chatSession, event, list, todoListLinkToEvent } from 'db/schema';
import { arrayOverlaps, eq, or } from 'drizzle-orm';
import { Content } from '@google/generative-ai';

type TodoListChange = {
  title: string;
  description: string;
  action: string;
  list_id: number;
  event_id: string;
};

type TodoChange = {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  repeat: string;
  repeat_duration: 'daily' | 'weekly' | 'monthly' | 'yearly';
  action: string;
  list_id: number;
  event_id: number;
};

type History = {
  todoListChanges: TodoListChange[];
  todoChanges: TodoChange[];
  texts: Content[];
};

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

export const POST = async (request: Request, userData: UserData) => {
  const history = (
    await db
      .select({
        history: chatSession.history,
        count: chatSession.count,
      })
      .from(chatSession)
      .where(eq(chatSession.user_id, userData.id))
  )[0];

  const ChangeHistory = (
    history.history?.map((change: string) => JSON.parse(change)) as Array<{
      todoListChanges: TodoListChange[];
      todoChanges: TodoChange[];
      texts: Content[];
    }>
  ).reduce(
    (acc, curr) => {
      return {
        todoListChanges: acc.todoListChanges.concat(curr.todoListChanges),
        todoChanges: acc.todoChanges.concat(curr.todoChanges),
        texts: acc.texts.concat(curr.texts),
      };
    },
    {
      todoListChanges: [],
      todoChanges: [],
      texts: [],
    },
  );

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
      id: event.id,
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
    current: {
      todos: todosCSV,
      todoLists: todolistsCSV,
    },
    change: {
      todos: ChangeHistory.todoChanges.map(objectToCSVLikeString).join('\n'),
      todoLists: ChangeHistory.todoListChanges
        .map(objectToCSVLikeString)
        .join('\n'),
    },
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
        character: 'User',
      },
      {
        text: change.response,
        character: 'System',
      },
    ],
  };

  if (!history.history) {
    await db.insert(chatSession).values({
      user_id: userData.id,
      history: [change],
    });
    return new Response(JSON.stringify(change), { status: 200 });
  } /*
  const ProcessedList = history.history
    .map((change: string) => JSON.parse(change) as History)
    .reduce(
      (acc, curr) => {
        return {
          todoListChanges: acc.todoListChanges
            .filter((list) =>
              curr.todoListChanges.some(
                (changeList) => changeList.list_id === list.list_id,
              ),
            )
            .concat(curr.todoListChanges),
          todoChanges: acc.todoChanges.concat(
            curr.todoChanges.filter((change) =>
              acc.todoChanges.some(
                (changeList) => changeList.list_id === change.list_id,
              ),
            ),
          ),
          texts: acc.texts.concat(curr.texts),
        };
      },
      {
        todoListChanges: [],
        todoChanges: [],
        texts: [],
      } as History,
    );*/

  await db.update(chatSession).set({
    history: history.history.concat([JSON.stringify(currentChat)]),
    count: history.count!,
  });

  return new Response(JSON.stringify(change), { status: 200 });
};

export const DELETE = async (request: Request, userData: UserData) => {
  await db.delete(chatSession).where(eq(chatSession.user_id, userData.id));
  return new Response('OK', { status: 200 });
};

export const PUT = async (request: Request, userData: UserData) => {
  const history = (
    await db
      .select({
        history: chatSession.history,
        count: chatSession.count,
      })
      .from(chatSession)
      .where(eq(chatSession.user_id, userData.id))
  )[0];

  const ChangeHistory = (
    history.history?.map((change: string) => JSON.parse(change)) as History[]
  )
    .reverse()
    .reduce(
      (prev, curr) => {
        return {
          todoListChanges: prev.todoListChanges.concat(
            curr.todoListChanges
              .filter((l) => {
                return l.action !== 'nochange';
              })
              .filter(
                (change) =>
                  prev.todoListChanges.length === 0 ||
                  prev.todoListChanges.some(
                    (changeList) => changeList.list_id !== change.list_id,
                  ),
              ),
          ),
          todoChanges: prev.todoChanges.concat(
            curr.todoChanges
              .filter((l) => {
                return l.action !== 'nochange';
              })
              .filter(
                (change) =>
                  prev.todoChanges.length === 0 ||
                  prev.todoChanges.some(
                    (changeList) => changeList.event_id !== change.event_id,
                  ),
              ),
          ),
          texts: prev.texts.concat(curr.texts),
        };
      },
      {
        todoListChanges: [],
        todoChanges: [],
        texts: [],
      },
    );
  console.log(ChangeHistory);
  await Promise.all([
    ChangeHistory.todoListChanges.forEach(async (change) => {
      switch (change.action) {
        case 'remove':
          await db.delete(list).where(eq(list.id, change.list_id));
          break;
        case 'update':
          await db
            .update(list)
            .set({
              title: change.title,
              description: change.description,
            })
            .where(eq(list.id, change.list_id));
          break;
        case 'add':
          await db.insert(list).values({
            title: change.title,
            description: change.description,
            owner_id: userData.id,
          });
          break;
      }
    }),
    ChangeHistory.todoChanges.forEach(async (change) => {
      switch (change.action) {
        case 'remove':
          await db.delete(event).where(eq(event.id, Number(change.event_id)));
          break;
        case 'update':
          await db
            .update(event)
            .set({
              title: change.title,
              description: change.description,
            })
            .where(eq(event.id, Number(change.event_id)));
          break;
        case 'add':
          await db.insert(event).values({
            title: change.title,
            description: change.description,
            start_date: new Date(change.start_date),
            end_date: new Date(change.end_date),
            loop: change.repeat === 'true',
            loop_duration: change.repeat_duration,
            creater_id: userData.id,
          });
          await db.insert(todoListLinkToEvent).values({
            list_id: change.list_id,
            event_id: change.event_id,
          });
          break;
      }
    }),
  ]);
  console.log('Changes processed');
  return new Response('Changes processed', { status: 202 });
};

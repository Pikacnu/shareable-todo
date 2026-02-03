import {
  LoaderFunctionArgs,
  redirect,
  useFetcher,
  useLoaderData,
} from 'react-router';
import { chatSession } from 'db/schema';
import { eq } from 'drizzle-orm';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getUserDataByRequest } from '~/function/getUserData';
import { db } from '~/services/db.server';

export const meta = () => {
  return [{ title: 'AI', description: 'AI page for testing AI' }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return redirect('/dashboard');
  const userData = await getUserDataByRequest(request);
  if (!userData) {
    return redirect('/login');
  }
  let chatSessionData = await db
    .select({
      history: chatSession.history,
    })
    .from(chatSession)
    .where(eq(chatSession.user_id, userData.id));
  if (chatSessionData.length === 0) {
    chatSessionData = await db
      .insert(chatSession)
      .values({
        user_id: userData.id,
      })
      .onConflictDoNothing()
      .returning({ history: chatSession.history });
  }
  const chatHistory = (chatSessionData[0]?.history || []).map((history) =>
    JSON.parse(history),
  );
  const messageHistory = chatHistory.map((history) => history.texts).flat();
  const updateTodoList = chatHistory
    .map((history) => history.todoListChanges)
    .flat();
  const updateTodo = chatHistory.map((history) => history.todoChanges).flat();
  return {
    messageHistory,
    updateTodoList,
    updateTodo,
  };
};

enum Character {
  System = 'System',
  User = 'User',
}

enum ResponseType {
  Success = 'Success',
  Error = 'Error',
}

type Message = {
  character: Character;
  text: string;
  type?: ResponseType;
};

enum ChangeType {
  Add = 'add',
  Remove = 'remove',
  Update = 'update',
  NoChange = 'nochange',
}

enum RepeatDuration {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Yearly = 'Yearly',
}

type TodoChange = {
  title: string;
  description: string;
  action: ChangeType;
  start_date: string;
  end_date: string;
  repeat: boolean;
  repeat_duration: RepeatDuration;
  list_id: string;
  event_id: string;
};

type TodoListChange = {
  title: string;
  description: string;
  list_id: string;
  action: ChangeType;
};

export default function AI() {
  const input = useRef<HTMLInputElement>(null);
  const { messageHistory, updateTodoList, updateTodo } =
    useLoaderData<typeof loader>();
  const [history, setHistory] = useState<Message[]>(messageHistory || []);
  const [todoListChanges, setTodoListChanges] = useState<TodoListChange[]>(
    updateTodoList || [],
  );
  const [todoChanges, setTodoChanges] = useState<TodoChange[]>(
    updateTodo || [],
  );
  const [pending, setPending] = useState(false);
  const fetcher = useFetcher();
  const lastTimeRef = useRef(new Date().getTime());
  const last = useCallback(() => {
    if (new Date().getTime() - lastTimeRef.current > 5000) {
      lastTimeRef.current = new Date().getTime();
      return true;
    }
    return false;
  }, []);
  const send = useCallback(async () => {
    if (last()) {
      return;
    }
    if (input.current && input.current.value === '') return;
    if (!input.current) return;
    const text = input.current.value;
    input.current.value = '';
    setPending(true);
    setHistory((prev) => [...prev, { character: Character.User, text }]);
    const formData = new FormData();
    formData.append('text', input.current.value);
    const res = await fetch('/api/ai', {
      method: 'POST',
      body: JSON.stringify({
        text: text,
        pendingChange: todoChanges,
        pendingListChange: todoListChanges,
      }),
    });
    setPending(false);
    const data = await res.json();
    if (data.error) {
      setHistory((prev) => [
        ...prev,
        {
          character: Character.System,
          text: data.error,
          type: ResponseType.Error,
        },
      ]);
      return;
    }
    const response = data.response;
    setHistory((prev) => [
      ...prev,
      {
        character: Character.System,
        text: response,
        type: ResponseType.Success,
      },
    ]);
    setTodoChanges((prev) => [...prev, ...data['change-events']]);
    setTodoListChanges((prev) => [...prev, ...data['change-todo-lists']]);
  }, [last, todoChanges, todoListChanges]);
  useEffect(() => {
    if (document) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          send();
        }
      });
      return () => {
        document.removeEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            send();
          }
        });
      };
    }
  }, [send]);
  const ActionColorMap = new Map<ChangeType, string>([
    [ChangeType.Add, 'bg-green-300'],
    [ChangeType.Remove, 'bg-red-500'],
    [ChangeType.Update, 'bg-yellow-500'],
    [ChangeType.NoChange, 'bg-gray-200'],
  ]);
  return (
    <div className="flex flex-col w-full h-[80vh] justify-center items-center">
      <div className="flex-grow bg-gray-500 w-[90vw] rounded-lg overflow-y-auto *:w-1/2 text-black flex flex-row ">
        <div className="flex flex-col gap-4 overflow-y-auto">
          {history.map((data, i) => (
            <div className="flex flex-row gap-4" key={i}>
              <div
                className={`rounded-lg p-2 m-2  ${
                  data.character === Character.System
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200'
                }`}
              >
                {data.text}
              </div>
            </div>
          ))}
          <div
            className={`flex flex-row ml-4 mt-4 gap-2 *:w-2 *:h-2 *:bg-blue-800 *:rounded-full ${
              pending ? 'block' : 'hidden'
            }`}
          >
            <div className="animate-bounce"></div>
            <div className="animate-bounce animation-delay-100"></div>
            <div className="animate-bounce animation-delay-200"></div>
          </div>
        </div>
        <div className="flex flex-col overflow-y-auto">
          {todoListChanges.map((todoListChange) => (
            <div key={todoListChange.list_id} className="flex flex-col gap-4">
              <div
                className={`bg-gray-300 p-2 rounded-lg ${
                  ActionColorMap.get(todoListChange.action) || ''
                }`}
              >
                <h1>{todoListChange.title}</h1>
                <p>{todoListChange.description}</p>
              </div>
              <div className="ml-4 gap-2 flex flex-col">
                {todoChanges
                  .filter((todo) => {
                    if (todo.list_id !== todoListChange.list_id) return false;
                    if (
                      todoChanges.some(
                        (subtodo) =>
                          subtodo.action === ChangeType.Remove &&
                          subtodo.event_id === todo.event_id &&
                          subtodo.list_id === todo.list_id &&
                          todo.action === ChangeType.Add,
                      )
                    )
                      return false;
                    return todo.list_id === todoListChange.list_id;
                  })
                  .map((todoChange, j) => (
                    <div
                      key={`${todoChange.event_id}-${j}`}
                      className={`bg-gray-200 p-2 rounded-lg ${
                        todoChange.action === ChangeType.Remove
                          ? 'bg-red-500'
                          : ''
                      } ${
                        todoChange.action === ChangeType.Update
                          ? 'bg-yellow-500'
                          : ''
                      }
                    ${
                      todoChange.action === ChangeType.Add ? 'bg-green-300' : ''
                    }
                    `}
                    >
                      <h1>Title :{todoChange.title}</h1>
                      <p>Description : {todoChange.description}</p>
                      <div className="flex flex-row gap-4">
                        <p>{todoChange.start_date}</p>
                        <p>{todoChange.end_date}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-4 ml-4">
            {todoChanges
              .filter(
                (todo) =>
                  todoListChanges.length === 0 ||
                  todoListChanges.some(
                    (todoList) => todoList.list_id !== todo.list_id,
                  ),
              )
              .map((todoChange) => (
                <div key={todoChange.event_id} className="flex flex-col gap-4">
                  <div
                    className={`bg-gray-200 p-2 rounded-lg ${
                      todoChange.action === ChangeType.Remove
                        ? 'bg-red-500'
                        : ''
                    } ${
                      todoChange.action === ChangeType.Update
                        ? 'bg-yellow-500'
                        : ''
                    }
                    ${
                      todoChange.action === ChangeType.Add ? 'bg-green-300' : ''
                    }
                    `}
                  >
                    <h1>{todoChange.title}</h1>
                    <p>{todoChange.description}</p>
                    <div className="flex flex-row gap-4">
                      <p>{todoChange.start_date}</p>
                      <p>{todoChange.end_date}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-center bg-slate-600 m-4 p-2 max-w-min rounded-full gap-4">
        <input type="text" ref={input} className="w-[50vw] rounded-full p-2" />
        <button
          className="rounded-full bg-blue-500 p-2"
          onClick={send}
          disabled={pending}
        >
          <img
            src="/icons/send.svg"
            alt="Send"
            className=" object-fill w-6 rounded-full"
          />
        </button>
        <button
          className="rounded-full bg-green-500 p-2"
          onClick={() => {
            fetcher.submit('', {
              method: 'PUT',
              action: '/api/ai',
            });
            setTodoChanges([]);
            setTodoListChanges([]);
            setHistory([]);
          }}
        >
          <img
            src="/icons/save.svg"
            alt="Apply Changes"
            className=" object-fill w-6 rounded-full"
          />
        </button>
        <button
          className="rounded-full bg-red-500 p-2"
          onClick={() => {
            fetcher.submit('', {
              method: 'DELETE',
              action: '/api/ai',
            });
            setTodoChanges([]);
            setTodoListChanges([]);
            setHistory([]);
          }}
        >
          <img
            src="/icons/trash.svg"
            alt="Clear"
            className=" object-fill w-6 rounded-full"
          />
        </button>
      </div>
    </div>
  );
}

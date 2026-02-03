import { useState } from 'react';
import {
  useFetcher,
  LoaderFunctionArgs,
  useSearchParams,
} from 'react-router-dom';
import { authenticator } from '~/services/auth.server';
import { db } from '~/services/db.server';
import { list, user } from 'db/schema';
import { or, eq, arrayOverlaps } from 'drizzle-orm';
import { useLoaderData } from '@remix-run/react';
import { getTodoLists } from '~/function/getUserData';
import {
  Calendar,
  CalendarClock,
  CalendarPlus2,
  ClipboardPlus,
  Repeat,
  Repeat1,
  Trash,
} from 'lucide-react';

export const meta = () => {
  return [
    {
      title: 'Add Todo',
      description: 'add todo to your list',
    },
  ];
};

interface TodoListInfo {
  id: number;
  title: string;
  description: string | null;
}

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const userData = await authenticator.isAuthenticated(request);
    const userInfoFromDB = (
      await db
        .select()
        .from(user)
        .where(eq(user.email, userData?.email || ''))
    )[0];
    const todoLists: TodoListInfo[] = await db
      .select({
        id: list.id,
        title: list.title,
        description: list.description,
      })
      .from(list)
      .where(
        or(
          eq(list.owner_id, userInfoFromDB.id),
          arrayOverlaps(list.shareWith, [userInfoFromDB.id]),
        ),
      );
    const todolistdata = await getTodoLists(userInfoFromDB.id);
    return { todolists: todoLists, todolistdata: todolistdata };
  } catch (e) {
    console.error(e);
    return { todolists: [], todolistdata: [] };
  }
}

const toTimeInputString = (date: Date) => {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
};

export default function Add() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isToday, setIsToday] = useState(false);
  const [selectedTodoLists, setselectedTodoLists] = useState<TodoListInfo[]>(
    [],
  );
  const searchParams = useSearchParams()[0];

  const [startDatetime, setStartDatetime] = useState(
    toTimeInputString(
      new Date(
        searchParams.get('startDate') ||
          searchParams.get('date') ||
          new Date().toISOString(),
      ),
    ),
  );
  const [endDatetime, setEndDatetime] = useState(
    toTimeInputString(
      new Date(
        searchParams.get('endDate') ||
          searchParams.get('date') ||
          new Date().toISOString(),
      ),
    ),
  );
  const [loop, setLoop] = useState(false);
  const [loopDuration, setLoopDuration] = useState('daily');
  const addTodo = useFetcher();
  const clearTempData = () => {
    setTitle('');
    setDescription('');
    setIsToday(false);
    setselectedTodoLists([]);
    setStartDatetime(toTimeInputString(new Date()));
    setEndDatetime(toTimeInputString(new Date()));
    setLoop(false);
    setLoopDuration('daily');
  };
  const submit = (
    title: string,
    description: string,
    isToday: boolean,
    startDatetime: string,
    endDatetime: string,
    selectedTodoLists: TodoListInfo[],
    loop: boolean,
    loopDuration: string,
    clear = false,
  ) => {
    if (title === '') return alert('Title can not be blank');
    if (title.trim().length === 0)
      return alert('Title and description can not be blank');
    if (selectedTodoLists.length === 0)
      return alert('Please select a todo list');
    const formData = new FormData();
    Object.entries({
      title,
      description,
      isToday,
      startDatetime,
      endDatetime,
      loop,
      loopDuration,
    }).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    formData.append(
      'selectedTodoLists',
      selectedTodoLists.map((item) => item.id).join(','),
    );
    addTodo.submit(formData, { method: 'post', action: '/api/todo' });
    if (clear) clearTempData();
  };
  const { todolists, todolistdata } = useLoaderData<typeof loader>();

  return (
    <div className="flex lg:flex-row flex-col w-full overflow-hidden overflow-y-auto lg:overflow-hidden max-md:m-2 h-[90vh] lg:h-[80vh] justify-between lg:*:w-1/2 *:m-2 max-w-[100vw] relative">
      <div className="flex flex-col p-8 bg-slate-700 justify-between h-full lg:overflow-hidden overflow-visible rounded-lg">
        <div className="flex flex-col flex-grow relative max-w-full ">
          <div className="flex flex-col *:my-2 lg:h-[50%]">
            <input
              type="text"
              className="max-w-full overflow-hidden outline outline-2 rounded-md p-1 outline-gray-400/40 bg-transparent"
              placeholder="Title"
              value={title}
              minLength={3}
              maxLength={50}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              className=" resize-none h-[10vh] lg:h-[60%] max-w-full overflow-hidden outline outline-2 rounded-md p-1 outline-gray-400/40 bg-transparent"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex flex-row space-x-4 items-center *:rounded-xl *:p-2 *:select-none *:transition-colors *:duration-100 *:outline *:outline-1 *:outline-gray-400/40">
              <input
                type="checkbox"
                id="Today"
                name="Today"
                className="hidden"
                checked={isToday}
                onChange={(e) => setIsToday(e.target.checked)}
              />
              <input
                type="checkbox"
                name="loop"
                id="loop"
                className="hidden"
                checked={loop}
                onChange={() => setLoop((prev) => !prev)}
              />
              <label
                htmlFor="Today"
                className={!isToday ? 'text-green-500' : ''}
              >
                {isToday ? <Calendar /> : <CalendarClock />}
              </label>
              <label htmlFor="loop" className={loop ? 'text-green-500' : ''}>
                {loop ? <Repeat /> : <Repeat1 />}
              </label>
            </div>
            <div
              className={
                'flex space-x-3 justify-center flex-wrap items-center w-full lg:w-auto gap-2 *:justify-between *:w-full outline-1 outline outline-gray-400/40 rounded-md bg-white/5 relative overflow-hidden' +
                (isToday ? ' select-none pointer-events-none' : '')
              }
            >
              <div
                className={`absolute w-full h-full z-10 ${
                  isToday
                    ? 'bg-gray-500/60'
                    : 'bg-transparent select-none pointer-events-none'
                }`}
              ></div>
              <div className="flex flex-row justify-between ">
                <label htmlFor="startDateTime">From</label>
                <input
                  disabled={isToday}
                  type="datetime-local"
                  name="startDateTime"
                  className="outline outline-2 rounded-md outline-gray-400/40 bg-transparent"
                  value={startDatetime}
                  onChange={(e) => setStartDatetime(e.target.value)}
                />
              </div>
              <div className="flex justify-between">
                <label htmlFor="endDateTime">To</label>
                <input
                  disabled={isToday}
                  type="datetime-local"
                  name="endDateTime"
                  className="outline outline-2 rounded-md outline-gray-400/40 bg-transparent"
                  value={endDatetime}
                  onChange={(e) => setEndDatetime(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-around items-center">
            <p
              className={
                'flex flex-col items-center ' + (loop ? '' : 'text-gray-400')
              }
            >
              Loop Duration{' '}
            </p>
            <select
              name="loopDuration"
              id="loopDuration"
              disabled={!loop}
              className=" outline outline-1 outline-gray-400/40 bg-transparent rounded-md *:bg-black"
              value={loopDuration}
              onChange={(e) => setLoopDuration(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden p-1">
            <label htmlFor="select-affectlist">Affect Lists</label>
            <select
              id="select-affectlist"
              className=" outline outline-1 outline-gray-400/40 bg-transparent rounded-md *:bg-black"
              onChange={(e) => {
                e.preventDefault();
                const selectIndex = Number(e.target.value);
                const selectedList = todolists.find(
                  (item) => item.id === selectIndex,
                );
                if (
                  selectedTodoLists.some((item) => item.id === selectedList?.id)
                )
                  return;
                if (selectedList) {
                  setselectedTodoLists([...selectedTodoLists, selectedList]);
                }
              }}
            >
              <option value="none" id="option">
                select todo list
              </option>
              {todolists
                .filter(
                  (item) =>
                    !selectedTodoLists.some((list) => list.id === item.id),
                )
                .map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.title}
                  </option>
                ))}
            </select>
            <div className="*:m-2 *:outline *:outline-1 *:outline-gray-400/40 *:rounded-md *:p-2 max-h-32 overflow-y-auto flex flex-col gap-2">
              {selectedTodoLists.map((list) => (
                <div
                  key={list.id}
                  className=" flex flex-row justify-between items-center"
                >
                  <div className="flex flex-col">
                    <p className="font-bold">{list.title}</p>
                    <p className="text-sm">{list.description}</p>
                  </div>
                  <button
                    className="outline-1 outline-gray-400/40 rounded-md p-1 bg-red-500/60 hover:bg-red-500/80 sticky left-0 top-0"
                    onClick={() => {
                      setselectedTodoLists(
                        selectedTodoLists.filter((item) => item.id !== list.id),
                      );
                    }}
                  >
                    <Trash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-black flex flex-row rounded-lg justify-end gap-2">
          <button
            className="bg-gray-800 hover:bg-gray-600 text-white font-bold p-2 rounded outline-1 outline-gray-400/40 outline"
            onClick={() => {
              submit(
                title,
                description,
                isToday,
                startDatetime,
                endDatetime,
                selectedTodoLists,
                loop,
                loopDuration,
                true,
              );
            }}
          >
            <CalendarPlus2 />
          </button>
          <button
            className="bg-gray-800 hover:bg-gray-600 text-white font-bold p-2 rounded outline-1 outline-gray-400/40 outline"
            onClick={() =>
              submit(
                title,
                description,
                isToday,
                startDatetime,
                endDatetime,
                selectedTodoLists,
                loop,
                loopDuration,
                false,
              )
            }
          >
            <ClipboardPlus />
          </button>
        </div>
      </div>
      <div className="flex-col lg:w-full overflow-visible lg:overflow-hidden relative lg:flex max-xl:hidden">
        <h1 className="bg-gray-500 w-auto p-2">Preview - Lists</h1>
        <div className="h-full text-black bg-gray-500 m-4 lg:m-0">
          {todolistdata.map((todoList) => {
            let Todo = todoList.Todo;
            if (selectedTodoLists.some((data) => data.id === todoList.id))
              Todo = [
                ...todoList.Todo,
                {
                  title,
                  description,
                  id: -1,
                  datetime: endDatetime,
                  isToday:
                    new Date(startDatetime).getDate() ===
                    new Date(endDatetime).getDate(),
                  finished: false,
                  preview: true,
                },
              ];
            if (Todo.length === 0) return null;
            return (
              <div key={todoList.id} className="m-4">
                <h2 className="text-xl">{todoList.title}</h2>
                {Todo.map((todo) => (
                  <div
                    key={`todo-${todo.id}`}
                    className={`flex flex-row ${
                      todo?.preview ? 'bg-yellow-200' : 'bg-gray-200'
                    } *:p-2 items-center overflow-hidden relative outline outline-2`}
                  >
                    <div className=" justify-between flex-grow overflow-hidden *:text-clip *:text-wrap ">
                      <p>Title : {todo.title}</p>
                      {todo.description && (
                        <p className=" text-clip text-wrap whitespace-break-spaces">
                          Description : {todo.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

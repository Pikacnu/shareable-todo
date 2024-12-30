import { useState } from 'react';
import { useFetcher, LoaderFunctionArgs } from 'react-router-dom';
import { authenticator } from '~/services/auth.server';
import { db } from '~/services/db.server';
import { list, user } from 'db/schema';
import { or, eq, arrayOverlaps } from 'drizzle-orm';
import { useLoaderData } from '@remix-run/react';
import { getTodoLists } from '~/function/getUserData';

export const meta = () => {
  return [
    {
      title: 'Add Todo',
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

export default function Add() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isToday, setIsToday] = useState(false);
  const [selectedTodoLists, setselectedTodoLists] = useState<TodoListInfo[]>(
    [],
  );
  const now = new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000;
  const defaultDateString = new Date(now).toISOString().slice(0, 16);
  const [selectIndex, setSelectIndex] = useState(0);
  const [startDatetime, setStartDatetime] = useState(defaultDateString);
  const [endDatetime, setEndDatetime] = useState(defaultDateString);
  const addTodo = useFetcher();
  const clearTempData = () => {
    setTitle('');
    setDescription('');
    setIsToday(false);
    setselectedTodoLists([]);
    setSelectIndex(0);
    setStartDatetime(defaultDateString);
    setEndDatetime(defaultDateString);
  };
  const submit = (
    title: string,
    description: string,
    isToday: boolean,
    startDatetime: string,
    endDatetime: string,
    selectedTodoLists: TodoListInfo[],
    clear?: boolean,
  ) => {
    if (title === '') return alert('Title can not be blank');
    if (selectedTodoLists.length === 0)
      return alert('Please select a todo list');
    const formData = new FormData();
    Object.entries({
      title,
      description,
      isToday,
      startDatetime,
      endDatetime,
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
    <div className="flex lg:flex-row flex-col w-full overflow-hidden overflow-y-auto lg:overflow-hidden m-4 h-[90vh] lg:h-[80vh] justify-between lg:*:w-1/2 *:m-4 max-w-[100vw] relative">
      <div className="flex flex-col p-8 bg-slate-500 rounded-xl justify-between h-full lg:overflow-hidden overflow-visible">
        <div className="flex flex-col flex-grow relative max-w-full ">
          <div className="flex flex-col *:m-2 lg:h-[50%]">
            <input
              type="text"
              className="max-w-full overflow-hidden"
              placeholder="Title"
              value={title}
              minLength={3}
              maxLength={50}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              className=" resize-none h-[10vh] lg:h-[60%] max-w-full overflow-hidden"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex *:m-2">
              <input
                type="checkbox"
                id="Today"
                name="Today"
                checked={isToday}
                onChange={(e) => setIsToday(e.target.checked)}
              />
              <label htmlFor="Today" className=" select-none">
                Is only for today?
              </label>
            </div>
            <div
              className={
                'flex space-x-3 justify-center flex-wrap items-center w-full lg:w-auto' +
                (isToday ? ' hidden' : '')
              }
            >
              <div className="flex flex-row justify-between ">
                <label htmlFor="startDateTime">Start Date</label>
                <input
                  disabled={isToday}
                  type="datetime-local"
                  name="startDateTime"
                  value={startDatetime}
                  onChange={(e) => setStartDatetime(e.target.value)}
                />
              </div>
              <div className="flex justify-between">
                <label htmlFor="endDateTime">End Date</label>
                <input
                  disabled={isToday}
                  type="datetime-local"
                  name="endDateTime"
                  value={endDatetime}
                  onChange={(e) => setEndDatetime(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="select-affectlist">Affect Lists</label>
            <select
              id="select-affectlist"
              value={selectIndex}
              onChange={(e) => {
                setSelectIndex(Number(e.target.value));
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
            <button
              onClick={(e) => {
                e.preventDefault();
                const selectedList = todolists.find(
                  (item) => item.id === selectIndex,
                );
                setSelectIndex(0);
                if (
                  selectedTodoLists.some((item) => item.id === selectedList?.id)
                )
                  return;
                if (selectedList) {
                  setselectedTodoLists([...selectedTodoLists, selectedList]);
                }
              }}
            >
              Add!
            </button>
            <p className="m-2">
              Lists are the collections of events. You can add events to lists
              to
            </p>
            <div className="*:m-2">
              {selectedTodoLists.map((list) => (
                <div key={list.id} className=" flex flex-row justify-between">
                  <p>
                    {list.title} - {list.description}
                  </p>
                  <button
                    onClick={() => {
                      setselectedTodoLists(
                        selectedTodoLists.filter((item) => item.id !== list.id),
                      );
                    }}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white text-black flex flex-row justify-between *:m-2 rounded-lg p-2">
          <button
            onClick={() => {
              submit(
                title,
                description,
                isToday,
                startDatetime,
                endDatetime,
                selectedTodoLists,
                true,
              );
            }}
          >
            add
          </button>
          <button
            onClick={() =>
              submit(
                title,
                description,
                isToday,
                startDatetime,
                endDatetime,
                selectedTodoLists,
                false,
              )
            }
          >
            add others with same option
          </button>
        </div>
      </div>
      <div className="flex-col lg:w-full overflow-visible lg:overflow-hidden relative hidden lg:flex">
        <h1>Todo</h1>
        <div className="h-full text-black bg-white m-4 lg:m-0">
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
                },
              ];
            if (Todo.length === 0) return null;
            return (
              <div key={todoList.id} className="m-4">
                <h2 className="text-xl">{todoList.title}</h2>
                {Todo.map((todo) => (
                  <div
                    key={`todo-${todo.id}`}
                    className="flex flex-row bg-gray-200 *:p-2 items-center overflow-hidden relative outline outline-2"
                  >
                    <div className=" justify-between flex-grow overflow-hidden *:text-clip *:text-wrap ">
                      <p>Title : {todo.title}</p>
                      <p className=" text-clip text-wrap whitespace-break-spaces">
                        Description : {todo.description}
                      </p>
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

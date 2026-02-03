import { DropList } from '~/components/tododroplist';
import { user } from 'db/schema';
import { eq } from 'drizzle-orm';
import {
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
  useFetcher,
  useSearchParams,
} from 'react-router';
import { db } from '~/services/db.server';

import { useRef } from 'react';
import { getTodoLists } from '~/function/getUserData';
import { FolderPlus } from 'lucide-react';
import { isAuthenticated } from '~/services/auth';

export const meta = () => {
  return [
    {
      title: 'TodoLists',
      description: 'show all todoLists you have',
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const userData = await isAuthenticated(request);
    if (!userData) return redirect('/login');
    const userInfoFromDB = (
      await db
        .select()
        .from(user)
        .where(eq(user.email, userData?.user?.email || ''))
    )[0];
    const todoLists = await getTodoLists(userInfoFromDB.id);
    return {
      todolists: todoLists,
      url: process.env.URL,
    };
  } catch (e) {
    console.log(e);
    return {
      todolists: [],
      url: process.env.URL,
    };
  }
};

export default function Todolist() {
  const { todolists, url } = useLoaderData<typeof loader>();
  const Fetcher = useFetcher();
  const title = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams()[0];
  const todolistId = searchParams.get('id');
  return (
    <div className="w-full h-full flex flex-col items-center *:flex-grow *:w-full">
      <DropList
        todoList={todolists}
        url={url!}
        overwriteOpenState={
          todolistId
            ? [
                {
                  todoListID: Number(todolistId),
                  isOpen: true,
                },
              ]
            : undefined
        }
      />
      <div className="flex m-4 justify-between items-center flex-col sticky bottom-0 bg-white/10 rounded-xl w-11/12 lg:w-2/3">
        <h3 className=" text-xl font-bold">Create New Todo List</h3>
        <div className="flex flex-row flex-grow gap-4 m-4 w-full p-2">
          <div className="flex flex-col bg-white/10 *:p-2 flex-grow text-sm lg:text-xl *:flex-grow gap-4 *:m-2 rounded-xl *:rounded-xl">
            <input type="text" placeholder="title" ref={title} />
            <input type="text" placeholder="description" ref={description} />
          </div>
          <div className="flex items-center">
            <button
              className="p-2 bg-green-600 rounded-lg"
              onClick={() => {
                const formData = new FormData();
                if (title.current?.value.trim().length === 0) {
                  return alert('title and description is required');
                }
                formData.append('title', title.current?.value || '');
                formData.append(
                  'description',
                  description.current?.value || '',
                );
                Fetcher.submit(formData, {
                  action: '/api/todolist',
                  method: 'POST',
                });
              }}
            >
              <FolderPlus />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

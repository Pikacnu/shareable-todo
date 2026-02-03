import { DropList } from '~/components/tododroplist';
import { user } from 'db/schema';
import { eq } from 'drizzle-orm';
import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import { db } from '~/services/db.server';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { useRef } from 'react';
import { getTodoLists } from '~/function/getUserData';
import { FolderPlus } from 'lucide-react';

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
    const userData = await authenticator.isAuthenticated(request);
    if (!userData) return redirect('/login');
    const userInfoFromDB = (
      await db
        .select()
        .from(user)
        .where(eq(user.email, userData?.email || ''))
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

export default function TodoLists() {
  const { todolists, url } = useLoaderData<typeof loader>();
  const Fetcher = useFetcher();
  const title = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLInputElement>(null);
  return (
    <div className="w-full h-full flex flex-col items-center *:flex-grow *:w-full">
      <DropList todoList={todolists} url={url!} />
      <div className="flex m-4 justify-between items-center flex-grow flex-col w-full">
        <h3 className=" text-xl font-bold">Create New Todo List</h3>

        <div className="flex flex-row flex-grow w-full gap-4">
          <div className="flex flex-col bg-white/10 *:p-2 flex-grow text-sm lg:text-xl *:flex-grow gap-4 *:m-2 rounded-xl">
            <input type="text" placeholder="title" ref={title} />
            <input type="text" placeholder="description" ref={description} />
          </div>
          <button
            className="p-2 bg-green-600 rounded-lg"
            onClick={() => {
              const formData = new FormData();
              if (title.current?.value.trim().length === 0) {
                return alert('title and description is required');
              }
              formData.append('title', title.current?.value || '');
              formData.append('description', description.current?.value || '');
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
  );
}

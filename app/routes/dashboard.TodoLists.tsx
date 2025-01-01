import { DropList } from '~/components/tododroplist';
import { user } from 'db/schema';
import { eq } from 'drizzle-orm';
import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import { db } from '~/services/db.server';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { useRef } from 'react';
import { getTodoLists } from '~/function/getUserData';

export const meta = () => {
  return [
    {
      title: 'TodoLists',
      description: 'TodoLists',
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
    <div className="w-full h-full  ">
      <DropList todoList={todolists} url={url!} />
      <div className="flex m-4 max-lg:max-w-[90vw]">
        <div className="flex bg-slate-700 *:p-2 *:max-w-[20vw] flex-grow text-sm lg:text-xl">
          <input type="text" placeholder="title" ref={title} />
          <input type="text" placeholder="description" ref={description} />
        </div>
        <button
          className="p-2 w-32 bg-green-600"
          onClick={() => {
            const formData = new FormData();
            if (
              title.current?.value.trim().length === 0 ||
              description.current?.value.trim().length === 0
            ) {
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
          add
        </button>
      </div>
    </div>
  );
}

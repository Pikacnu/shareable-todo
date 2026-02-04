import { DropList } from '~/components/tododroplist';
import { user } from 'db/schema';
import { eq } from 'drizzle-orm';
import {
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
  useFetcher,
  useSearchParams,
  useBlocker,
} from 'react-router';
import { db } from '~/services/db.server';

import { useCallback, useRef, useState } from 'react';
import { getTodoLists } from '~/function/getUserData';
import { FolderPlus } from 'lucide-react';
import { isAuthenticated } from '~/services/auth/auth.server';

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
  const formData = useRef<HTMLFormElement>(null);
  const searchParams = useSearchParams()[0];
  const todolistId = searchParams.get('id');
  const [isDirty, setIsDirty] = useState(false);
  const blocker = useBlocker(useCallback(() => isDirty, [isDirty]));
  return (
    <div className="w-full h-full flex flex-col items-center *:grow *:w-full">
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
      <div className="flex m-4 md:fixed max-md:mb-0 justify-between items-center flex-col sticky bottom-0 bg-white/5 outline-1 outline-gray-400/40 md:rounded-xl w-11/12 md:w-2/3 backdrop-blur-md">
        {blocker.state === 'blocked' && (
          <div className="text-white bg-red-600 p-2 w-full absolute h-full z-10 top-0 left-0 flex flex-col items-center justify-center">
            <p className="bg-red-600">
              You have unsaved changes. Please save before leaving the page.
            </p>
            <div className=" flex flex-row w-full justify-center mt-4">
              <button
                className="m-2 p-2 bg-green-600 rounded-lg"
                onClick={() => {
                  setIsDirty(false);
                  blocker.proceed();
                }}
              >
                Leave without saving
              </button>
              <button
                className="m-2 p-2 bg-gray-600 rounded-lg"
                onClick={() => {
                  blocker.reset();
                }}
              >
                Stay on this page
              </button>
            </div>
          </div>
        )}
        <h3 className=" text-xl font-bold p-2">Create New Todo List</h3>
        <Fetcher.Form
          className="flex flex-row grow gap-4 m-4 w-full p-2"
          method="POST"
          action="/api/todolist"
          onChange={(e) => {
            const form = e.currentTarget as HTMLFormElement;
            const titleInput = form.title as unknown as HTMLInputElement;
            const descriptionInput = form.description as HTMLInputElement;
            setIsDirty(
              titleInput.value.trim().length > 0 ||
                descriptionInput.value.trim().length > 0,
            );
          }}
          onSubmitCapture={() => {
            setTimeout(() => {
              setIsDirty(false);
              formData.current?.reset();
            }, 0);
          }}
          onReset={() => setIsDirty(false)}
          ref={formData}
        >
          <div className="flex flex-col bg-white/5 outline-1 outline-gray-400/40 *:p-3 grow text-sm lg:text-xl *:grow gap-4 rounded-xl *:rounded-xl *:text-lg *:bg-transparent *:outline-none">
            <input type="text" placeholder="Title" name="title" ref={title} />
            <input
              type="text"
              placeholder="Description"
              name="description"
              ref={description}
            />
          </div>
          <div className="flex items-center">
            <button
              className="p-2 bg-green-600 hover:bg-green-500 transition-colors rounded-lg text-white"
              type="submit"
            >
              <FolderPlus />
            </button>
          </div>
        </Fetcher.Form>
      </div>
    </div>
  );
}

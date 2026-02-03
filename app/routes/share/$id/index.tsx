import { LoaderFunctionArgs, redirect, ActionFunctionArgs , useFetcher, useLoaderData } from 'react-router';
import { list, ShareID, user } from 'db/schema';
import { and, eq } from 'drizzle-orm';
import { getUserDataByRequest } from '~/function/getUserData';
import { db } from '~/services/db.server';

import { ShareStatus } from '~/components/tododroplist';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const id = params.id;
  if (id === undefined) {
    return redirect('/dashboard');
  }
  try {
    const userData = await getUserDataByRequest(request);
    if (!userData) {
      return redirect('/dashboard');
    }
    const todolist = (
      await db
        .select()
        .from(ShareID)
        .leftJoin(list, eq(ShareID.list_id, list.id))
        .where(eq(ShareID.share_id, id))
    )[0].list;
    if (!todolist) {
      return redirect('/dashboard');
    }
    let isOwner = true;
    if (todolist.owner_id !== userData.id) isOwner = false;
    let ownerName;
    if (!isOwner) {
      ownerName = (
        await db
          .select({ username: user.name })
          .from(user)
          .where(eq(user.id, todolist.owner_id))
      )[0].username;
    }
    return {
      username: userData.name,
      isOwner: isOwner,
      ownerName: ownerName || '',
      title: todolist.title,
      description: todolist.description,
      id: id,
    };
  } catch (e) {
    console.error(e);
    return redirect('/dashboard');
  }
};

export default function ShareTo() {
  const { username, isOwner, ownerName, title, id } =
    useLoaderData<typeof loader>();
  const Fetcher = useFetcher();
  return (
    <div className=" m-4 p-4 bg-gray-600 shadow-lg rounded-lg flex flex-col items-center justify-center">
      <h1>
        {isOwner ? 'You' : ownerName} Share {title} to {username}
      </h1>
      <button
        className=" m-4 outline outline-1 outline-offset-4 outline-black rounded-md"
        onClick={() => {
          const formData = new FormData();
          formData.append('share_id', id);
          Fetcher.submit(formData, {
            method: 'POST',
          });
        }}
      >
        Add TodoList
      </button>
    </div>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const userData = await getUserDataByRequest(request);
  if (userData === null) {
    return redirect('/dashboard');
  }
  const from = await request.formData();
  const share_id = from.get('share_id') as string;
  if (share_id === null) {
    return redirect('/dashboard');
  }
  const temp = (
    await db
      .select()
      .from(ShareID)
      .leftJoin(
        list,
        and(
          eq(ShareID.list_id, list.id),
          eq(list.shareStatus, ShareStatus.Public),
        ),
      )
      .where(eq(ShareID.share_id, share_id))
  )[0];
  if (!temp) {
    return redirect('/dashboard');
  }
  const listinfo = temp.list;
  if (!listinfo) {
    return redirect('/dashboard');
  }
  if (listinfo.owner_id === userData.id) {
    return redirect('/dashboard');
  }
  await db
    .update(list)
    .set({ shareWith: [...(listinfo.shareWith || []), userData.id] })
    .where(eq(list.id, listinfo.id));
  return redirect(`/dashboard`);
};

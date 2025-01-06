import { ActionFunctionArgs } from '@remix-run/node';
import { user, list } from 'db/schema';
import { authenticator } from '~/services/auth.server';
import { eq, and, arrayOverlaps } from 'drizzle-orm';
import { db } from '~/services/db.server';
import { ShareStatus } from '~/components/tododroplist';

const POST = async (request: Request) => {
  const formData = await request.formData();
  const title = formData.get('title') as string;
  const desctiprion = formData.get('description') as string;
  if (!title) return new Response('Title is required', { status: 400 });
  const userData = await authenticator.isAuthenticated(request);
  const userInfoFromDB = (
    await db
      .select()
      .from(user)
      .where(eq(user.email, userData?.email || ''))
  )[0];
  const insertedData = await db
    .insert(list)
    .values({
      title: title,
      description: desctiprion,
      owner_id: userInfoFromDB.id,
    })
    .returning({
      id: list.id,
      shareStatus: list.shareStatus,
    })
    .onConflictDoNothing();
  if (insertedData.length > 0) {
    console.log(insertedData);
    return new Response('Success', { status: 200 });
  }
  return new Response('Failed', { status: 400 });
};

const DELETE = async (request: Request) => {
  const formData = await request.formData();
  const id = parseInt(formData.get('id') as string);
  const userData = await authenticator.isAuthenticated(request);
  const userInfoFromDB = (
    await db
      .select()
      .from(user)
      .where(eq(user.email, userData?.email || ''))
  )[0];
  const deletedData = await db
    .delete(list)
    .where(and(eq(list.owner_id, userInfoFromDB.id), eq(list.id, id)))
    .returning({
      id: list.id,
    });

  if (deletedData.length > 0) {
    return new Response('Success', { status: 200 });
  }
  if (deletedData.length === 0) {
    const shareIDs = (
      await db
        .select()
        .from(list)
        .where(arrayOverlaps(list.shareWith, [userInfoFromDB.id]))
    )[0].shareWith;
    if (!shareIDs) return new Response('Failed', { status: 400 });
    const result = await db
      .update(list)
      .set({
        shareWith: shareIDs.filter((i) => i !== userInfoFromDB.id),
      })
      .returning({
        id: list.id,
      });
    if (result.length > 0) {
      return new Response('Success', { status: 200 });
    }
    return new Response('Failed', { status: 400 });
  }
  return new Response('Failed', { status: 400 });
};

const updateShareStatus = async (request: Request, formData: FormData) => {
  const id = parseInt(formData.get('id') as string);
  const shareStatus =
    (formData.get('shareStatus') as string as ShareStatus) ===
    ShareStatus.Public
      ? ShareStatus.Private
      : ShareStatus.Public;
  const userData = await authenticator.isAuthenticated(request);
  const userInfoFromDB = (
    await db
      .select()
      .from(user)
      .where(eq(user.email, userData?.email || ''))
  )[0];
  const updatedData = await db
    .update(list)
    .set({
      shareStatus: shareStatus,
    })
    .where(and(eq(list.owner_id, userInfoFromDB.id), eq(list.id, id)))
    .returning({
      id: list.id,
      shareStatus: list.shareStatus,
    });
  if (updatedData.length > 0) {
    return new Response('Success', { status: 200 });
  }
  return new Response('Failed', { status: 400 });
};

const updateInfo = async (request: Request, formData: FormData) => {
  const id = parseInt(formData.get('id') as string);
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  const userData = await authenticator.isAuthenticated(request);
  const userInfoFromDB = (
    await db
      .select()
      .from(user)
      .where(eq(user.email, userData?.email || ''))
  )[0];
  const updatedData = await db
    .update(list)
    .set({
      title: title,
      description: description,
    })
    .where(and(eq(list.owner_id, userInfoFromDB.id), eq(list.id, id)))
    .returning({
      id: list.id,
      shareStatus: list.shareStatus,
    });
  if (updatedData.length > 0) {
    return new Response('Success', { status: 200 });
  }
  return new Response('Failed', { status: 400 });
};

const PUT = async (request: Request) => {
  const formData = await request.formData();
  const type = formData.get('type') as string;
  switch (type) {
    case 'shareStatus':
      return updateShareStatus(request, formData);
    case 'updateInfo':
      return updateInfo(request, formData);
    default:
      return new Response('Failed', { status: 400 });
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  switch (request.method) {
    case 'POST':
      return POST(request);
    case 'DELETE':
      return DELETE(request);
    case 'PUT':
      return PUT(request);
    default:
      return new Response('Method not allowed', { status: 405 });
  }
};

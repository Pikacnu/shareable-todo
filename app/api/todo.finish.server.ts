import { finishState } from 'db/schema';
import { UserData } from '~/function/getUserData';
import { db } from '~/services/db.server';

export const POST = async (
  request: Request,
  userData: UserData,
): Promise<Response> => {
  const formData = await request.formData();
  const id = (formData.get('id') as string) || '';
  const finish =
    ((formData.get('finished') as string) || '')?.toLowerCase() === 'true';
  if (!id) {
    return new Response('Error: ID is required', {
      status: 400,
    });
  }
  await db
    .insert(finishState)
    .values({
      user_id: userData.id,
      event_id: parseInt(id),
      finish: finish,
    })
    .onConflictDoUpdate({
      target: [finishState.user_id, finishState.event_id],
      set: {
        finish: finish,
      },
    });
  return new Response('Finish Todo', {
    status: 200,
  });
};

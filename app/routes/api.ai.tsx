import { ActionFunctionArgs } from '@remix-run/node';
import { getUserDataByRequest } from '~/function/getUserData';
import { POST, DELETE, PUT } from '~/api/ai.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const userData = await getUserDataByRequest(request);
  if (!userData) {
    return new Response('Unauthorized', { status: 401 });
  }
  if (request.method === 'POST') {
    return POST(request, userData);
  }
  if (request.method === 'DELETE') {
    return DELETE(request, userData);
  }
  if (request.method === 'PUT') {
    console.log('PUT');
    return PUT(request, userData);
  }
};

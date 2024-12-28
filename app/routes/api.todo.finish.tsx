import { ActionFunction, ActionFunctionArgs } from '@remix-run/node';
import { getUserDataByRequest, UserData } from '~/function/getUserData';
import { POST } from '~/api/todo.finish';

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const method = request.method;
  let result;
  const userData: UserData = await getUserDataByRequest(request);
  switch (method) {
    case 'POST':
      result = POST(request, userData);
      break;
    default:
      result = new Response('Error: Unknow Problem', {
        status: 400,
      });
  }
  return result;
};

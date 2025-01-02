import { LoaderFunctionArgs } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { authenticator } from '~/services/auth.server';
import { AuthType } from '~/services/auth.type';

function LoginWith({ providor }: { providor: AuthType }) {
  return (
    <Form
      method="POST"
      action={`/auth/${providor}`}
      className="flex bg-gray-800 bg-opacity-30 rounded-2xl p-2 m-2"
    >
      <button type="submit" className="flex text-lg items-center *:m-2">
        <img
          src={`/icons/${providor}.svg`}
          alt={`${providor} icon`}
          className="max-w-8"
        />
        <p>Login with {providor}</p>
      </button>
    </Form>
  );
}

export function loader({ request }: LoaderFunctionArgs) {
  return authenticator.isAuthenticated(request, {
    successRedirect: '/dashboard',
  });
}

export default function Login() {
  return (
    <div className="flex flex-row w-full h-full">
      <div className="flex flex-col lg:w-1/3 bg-gray-500 bg-opacity-40 *:w-full">
        <div className="h-1/4 flex items-end justify-center">
          <h1 className="text-2xl text-center">Login</h1>
        </div>
        <div className="flex flex-col m-4 flex-grow items-center">
          <div>{LoginWith({ providor: AuthType.Discord })}</div>
        </div>
      </div>
      <div className="flex-grow max-lg:hidden"></div>
    </div>
  );
}

import { LoaderFunctionArgs } from 'react-router';
import { isAuthenticated } from '~/services/auth/auth.server';
import { authClient } from '~/services/auth/auth';
import { AuthType } from '~/services/auth/auth.type';

function LoginWith({ providor }: { providor: AuthType }) {
  const handleLogin = () => {
    authClient.signIn.social({
      provider: providor,
      callbackURL: '/dashboard',
    });
  };

  return (
    <button
      onClick={handleLogin}
      className="flex bg-gray-800 bg-opacity-30 rounded-2xl p-2 m-2 text-lg items-center *:m-2"
    >
      <img
        src={`/icons/${providor}.svg`}
        alt={`${providor} icon`}
        className="max-w-8"
      />
      <p>Login with {providor}</p>
    </button>
  );
}

export function loader({ request }: LoaderFunctionArgs) {
  return isAuthenticated(request, {
    successRedirect: '/dashboard',
  });
}

export default function Login() {
  return (
    <div className="flex flex-row w-full h-full overflow-hidden">
      <div className="flex flex-col w-full md:w-1/3 bg-gray-500 bg-opacity-40 *:w-full">
        <div className="h-1/4 flex items-end justify-center">
          <h1 className="text-2xl text-center">Login</h1>
        </div>
        <div className="flex flex-col m-4 grow items-center">
          <div>{LoginWith({ providor: AuthType.Discord })}</div>
        </div>
      </div>
      <div className="grow max-md:hidden"></div>
    </div>
  );
}

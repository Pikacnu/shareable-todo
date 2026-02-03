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
      className="flex bg-white/5 hover:bg-white/10 outline outline-1 outline-gray-400/20 rounded-2xl p-2 m-2 text-lg items-center *:m-2 transition-all w-full justify-center text-white"
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
    <div className="flex flex-row w-full h-full overflow-hidden text-white">
      <div className="flex flex-col w-full md:w-1/3 bg-white/5 outline outline-1 outline-gray-400/40 *:w-full justify-center">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-4xl font-bold italic text-green-500 mb-2">
            Shareable Todo
          </h1>
          <p className="text-slate-400">Organize your tasks with ease</p>
        </div>
        <div className="flex flex-col items-center px-8">
          <div className="w-full max-w-xs">
            {LoginWith({ providor: AuthType.Discord })}
          </div>
        </div>
      </div>
      <div className="grow max-md:hidden bg-[url('/method-img/login-bg.jpg')] bg-cover bg-center opacity-40"></div>
    </div>
  );
}

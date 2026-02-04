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
      className="flex bg-white/5 hover:bg-white/10 hover:text-green-400 outline-1 outline-gray-400/40 rounded-xl p-3 m-2 text-lg items-center gap-3 transition-all w-full justify-center text-white backdrop-blur-sm"
    >
      <img
        src={`/icons/${providor}.svg`}
        alt={`${providor} icon`}
        className="w-6 h-6"
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
      <div className="flex flex-col w-full md:w-1/3 bg-slate-800/50 outline-1 outline-gray-400/20 backdrop-blur-md z-10 justify-center shadow-2xl">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-5xl font-bold italic text-green-500 mb-2 drop-shadow-lg">
            Shareable Todo
          </h1>
          <p className="text-slate-300 text-lg">
            Organize your tasks with ease
          </p>
        </div>
        <div className="flex flex-col items-center px-8 w-full">
          <div className="w-full max-w-sm space-y-4">
            {LoginWith({ providor: AuthType.Discord })}
            {/* Add more providers here if needed */}
          </div>
        </div>
      </div>
      <div className="grow max-md:hidden bg-linear-to-br from-slate-700 to-slate-900 opacity-80 flex items-center justify-center">
        <img
          src="/method-img/Share.svg"
          alt="Login Visual"
          className="w-1/2 opacity-20"
        />
      </div>
    </div>
  );
}

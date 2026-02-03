import { LoaderFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import { Outlet, Link } from '@remix-run/react';
import {
  LayoutDashboard,
  CirclePlus,
  List,
  //MessageCircle,
  LogOut,
} from 'lucide-react';

export const loader = ({ request }: LoaderFunctionArgs) => {
  return authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });
};

export default function Dashboard() {
  return (
    <div className="flex flex-col md:flex-row w-full h-screen items-center justify-around overflow-hidden">
      <main className="flex md:flex-grow lg:m-2 w-full">
        <Outlet />
      </main>
      <nav className="m-4 p-4 right-0 fixed md:relative w-[calc(100%-2rem)] md:w-auto bottom-0 md:h-[90%] lg:h-[80%] bg-white rounded-3xl text-black flex flex-row md:flex-col justify-between text-sm md:text-xl lg:w-16">
        <div
          className="flex flex-row md:flex-col items-center lg:*:mt-4 max-lg:[&>a>img]:w-6 md:[&>a>img]:w-8 [&>a>p]:hidden md:[&>a>p]:block *:flex *:flex-col *:items-center text-lg 
          [&>*:hover]:bg-black/20 *:transition-all *:duration-200 *:rounded-3xl *:p-1 *:ml-4 *:md:ml-0 *:md:mt-4"
        >
          <Link to={'/dashboard'}>
            <LayoutDashboard />
          </Link>
          <Link to={'/dashboard/add'}>
            <CirclePlus />
          </Link>
          <Link to={'/dashboard/todolist'}>
            <List />
          </Link>
        </div>

        <Link
          to={'/logout'}
          className=" hover:bg-black/20 transition-all duration-200 rounded-3xl p-1"
        >
          <LogOut />
        </Link>
      </nav>
    </div>
  );
}

import { LoaderFunctionArgs, Outlet, Link } from 'react-router';
import { isAuthenticated } from '~/services/auth/auth.server';

import {
  LayoutDashboard,
  CirclePlus,
  List,
  //MessageCircle,
  LogOut,
} from 'lucide-react';

export const loader = ({ request }: LoaderFunctionArgs) => {
  return isAuthenticated(request, {
    failureRedirect: '/login',
  });
};

export default function Dashboard() {
  return (
    <div className="flex flex-col md:flex-row w-full h-screen items-center justify-around overflow-hidden relative">
      <main className="flex lg:grow lg:m-2 w-full h-full items-center justify-center">
        <Outlet />
      </main>
      <nav className="md:m-4 p-4 relative right-0 w-full bottom-0 md:h-[90%] lg:h-[80%] md:w-16 bg-white md:rounded-3xl text-black flex flex-row md:flex-col justify-between text-sm md:text-xl">
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

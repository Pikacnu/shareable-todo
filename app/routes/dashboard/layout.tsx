import { LoaderFunctionArgs, Outlet, Link } from 'react-router';
import { isAuthenticated } from '~/services/auth/auth.server';

import {
  LayoutDashboard,
  CirclePlus,
  List,
  //MessageCircle,
  LogOut,
  BookOpen,
} from 'lucide-react';

export const loader = ({ request }: LoaderFunctionArgs) => {
  return isAuthenticated(request, {
    failureRedirect: '/login',
  });
};

export default function Dashboard() {
  return (
    <div className="flex flex-col md:flex-row w-full h-screen items-center justify-around overflow-hidden relative text-white bg-slate-700">
      <main className="flex grow lg:m-2 w-full min-h-0 items-center justify-center overflow-hidden">
        <Outlet />
      </main>
      <nav className="md:m-4 p-4 relative right-0 w-full md:h-[90%] lg:h-[80%] md:w-16 bg-white/5 backdrop-blur-md outline-1 outline-gray-400/40 md:rounded-3xl text-white flex flex-row md:flex-col justify-between text-sm md:text-xl shrink-0 transition-colors overflow-y-hidden">
        <div
          className="flex flex-row md:flex-col items-center lg:*:mt-4 max-lg:[&>a>img]:w-6 md:[&>a>img]:w-8 [&>a>p]:hidden md:[&>a>p]:block *:flex *:flex-col *:items-center text-lg 
          [&>*:hover]:bg-white/20 *:transition-all *:duration-200 *:rounded-3xl *:p-1 *:ml-4 *:md:ml-0 *:md:mt-4"
        >
          <Link to={'/dashboard'} className="hover:text-green-500">
            <LayoutDashboard />
          </Link>
          <Link to={'/dashboard/add'} className="hover:text-green-500">
            <CirclePlus />
          </Link>
          <Link to={'/dashboard/todolist'} className="hover:text-green-500">
            <List />
          </Link>
          <Link to={'/dashboard/user-guide'} className="hover:text-green-500">
            <BookOpen />
          </Link>
        </div>

        <Link
          to={'/logout'}
          className=" hover:bg-white/20 transition-all duration-200 rounded-3xl p-1 hover:text-red-400"
        >
          <LogOut />
        </Link>
      </nav>
    </div>
  );
}

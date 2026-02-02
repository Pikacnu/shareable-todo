import { LoaderFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import { Outlet, Link } from '@remix-run/react';
import {
  LayoutDashboard,
  CirclePlus,
  List,
  MessageCircle,
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
      <div className="flex md:flex-grow m-2 w-full">
        <Outlet />
      </div>
      <div className="m-4 p-4 fixed md:relative w-4/5 md:w-auto bottom-0 md:h-[80%] bg-white rounded-3xl text-black flex flex-row md:flex-col justify-between text-sm md:text-xl">
        <div className="flex flex-row md:flex-col items-center *:ml-2 md:*:ml-0 md:*:mt-4 max-md:[&>a>img]:w-6 md:[&>a>img]:w-8 [&>a>p]:hidden md:[&>a>p]:block *:flex *:flex-col *:items-center text-lg">
          <Link to={'/dashboard'}>
            <LayoutDashboard />
          </Link>
          <Link to={'/dashboard/add'}>
            <CirclePlus />
          </Link>
          <Link to={'/dashboard/todoLists'}>
            <List />
          </Link>
          <Link to={'/dashboard/ai'}>
            <MessageCircle />
          </Link>
        </div>
        <div>
          <Link to={'/logout'}>
            <LogOut />
          </Link>
        </div>
      </div>
    </div>
  );
}

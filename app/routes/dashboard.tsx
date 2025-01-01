import { LoaderFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import { Outlet, Link } from '@remix-run/react';

export const loader = ({ request }: LoaderFunctionArgs) => {
  return authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });
};

export default function Dashboard() {
  return (
    <div className="flex flex-col lg:flex-row w-full h-screen items-center justify-around overflow-hidden">
      <div className="flex lg:flex-grow m-2 w-full">
        <Outlet />
      </div>
      <div className="m-4 p-4 fixed lg:relative w-4/5 lg:w-auto bottom-0 lg:h-[80%] bg-white rounded-3xl text-black flex flex-row lg:flex-col justify-between text-sm lg:text-xl">
        <div className="flex flex-row lg:flex-col items-center *:ml-2 lg:*:ml-0 lg:*:mt-4">
          <Link to={'/dashboard'}>Dashboard</Link>
          <Link to={'/dashboard/add'}>Add</Link>
          <Link to={'/dashboard/todoLists'}>TodoList</Link>
        </div>
        <div>
          <Link to={'/logout'}>Logout</Link>
        </div>
      </div>
    </div>
  );
}

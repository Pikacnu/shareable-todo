import { Home, Info, LogIn } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-row justify-around p-2 *:grow *:text-center bg-white/5 shadow-2xl sticky top-0 z-10">
        <div className="flex flex-row gap-4 *:p-2 *:rounded-xl *:hover:bg-white/10 transition-all duration-200">
          <Link to={'/'} className="text-white text-xl">
            <Home />
          </Link>
          <Link to="/login" className="text-white text-xl">
            <LogIn />
          </Link>
          <Link to="/info" className="text-white text-xl">
            <Info />
          </Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

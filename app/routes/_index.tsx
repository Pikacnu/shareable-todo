import { Link } from '@remix-run/react';

export default function Index() {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-row justify-around p-4 *:flex-grow *:text-center bg-gray-600">
        <Link to="/login" className="text-white text-xl">
          Login
        </Link>
        <Link to="/" className="text-white text-xl">
          Info
        </Link>
      </div>
      <div className="h-full w-full">
        <div className="h-full w-full flex flex-col *:flex *:flex-row text-black [&>*:nth-child(odd)]:flex-row-reverse">
          <div>
            <div className="w-1/2 flex-shrink-0"></div>
            <div className="m-4 rounded-lg bg-gray-200 p-4 w-full">
              <p>Make TodoList Shareable To Firend and Collbrators</p>
            </div>
          </div>
          <div>
            <div className="w-1/2 flex-shrink-0"></div>
            <div className="m-4 rounded-lg bg-gray-200 p-4 w-full">
              <p>Check When complete</p>
            </div>
          </div>

          <div>
            <div className="w-1/2 flex-shrink-0"></div>
            <div className="m-4 rounded-lg bg-gray-200 p-4 w-full">
              <p>Events give you more method to plan your schedule</p>
            </div>
          </div>

          <div>
            <div className="w-1/2 flex-shrink-0"></div>
            <div className="m-4 rounded-lg bg-gray-200 p-4 w-full">
              <p>Simple and Realtime Preview Make you won{"'"}t add something wrong</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from '@remix-run/react';

export const meta = () => {
  return [
    {
      title: 'Share TodoList',
      description: 'help you share todolist to your friends and collbrators',
    },
  ];
};

export default function Index() {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-row justify-around p-2 *:flex-grow *:text-center bg-gray-600 ">
        <div className="flex flex-row gap-4 *:p-2">
          <Link to="/login" className="text-white text-xl">
            Login
          </Link>
          <Link to="/" className="text-white text-xl">
            Info
          </Link>
        </div>
      </div>
      <div className="h-full w-full">
        <div className="h-full w-full flex flex-col *:flex *:flex-row text-black [&>*:nth-child(odd)]:flex-row-reverse *:m-4 ">
          <div>
            <div className="w-1/2 flex-shrink-0 flex justify-center">
              <img src="/Share.svg" alt="" className="self-center w-1/2" />
            </div>
            <div className="m-4 rounded-lg bg-gray-200 p-4 w-full h-min self-center flex flex-col">
              <h1 className="text-2xl">
                Make TodoList Shareable To Firend and Collbrators
              </h1>
              <p>
                Share your todolist to your friends and collbrators, make
                collaboration easier
              </p>
            </div>
          </div>
          <div>
            <div className="w-1/2 flex-shrink-0 flex justify-center">
              <img
                src="/Private_Share_State.svg"
                alt=""
                className="self-center w-1/2"
              />
            </div>
            <div className="m-4 rounded-lg bg-gray-200 p-4 w-full h-min self-center">
              <h1 className="text-2xl">Check When complete</h1>
              <p>
                Check when your friends and collbrators complete the task, make
                you more efficient
              </p>
            </div>
          </div>

          <div>
            <div className="w-1/2 flex-shrink-0 flex justify-center">
              <img
                src="/Event_Notify.svg"
                alt=""
                className="self-center w-1/2"
              />
            </div>
            <div className="m-4 rounded-lg bg-gray-200 p-4  w-full h-min self-center">
              <h1 className="text-2xl">
                Fast Check Event which is around the corner
              </h1>
              <p>
                Fast check the event which is near the end, make you won{"'"}t
                miss the deadline
              </p>
            </div>
          </div>
          {/*
          <div>
            <div className="w-1/2 flex-shrink-0"></div>
            <div className="m-4 rounded-lg bg-gray-200 p-4 w-full">
              <p>
                Simple and Realtime Preview Make you won{"'"}t add something
                wrong
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

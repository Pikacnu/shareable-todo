import { Link } from '@remix-run/react';

export const meta = () => {
  return [
    {
      title: 'Share TodoList',
      description:
        'Help you share your to-do list with your friends and collaborators',
    },
  ];
};

export default function Index() {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-row justify-around p-2 *:flex-grow *:text-center bg-gray-600 sticky top-0 z-10">
        <div className="flex flex-row gap-4 *:p-2">
          <Link to={'/'} className="text-white text-xl">
            Home
          </Link>
          <Link to="/login" className="text-white text-xl">
            Login
          </Link>
          <Link to="/info" className="text-white text-xl">
            Info
          </Link>
        </div>
      </div>
      <div className="h-full w-full">
        <div className="h-full w-full flex flex-col *:flex *:flex-row text-black max-md:*:flex-col child:child:max-md:w-full md:[&>*:nth-child(odd)]:flex-row-reverse *:m-4 ">
          <div>
            <div className="w-1/2 flex-shrink-0 flex justify-center">
              <img
                src="/method-img/Share.svg"
                alt=""
                className="self-center w-1/2"
              />
            </div>
            <div className="m-4 rounded-lg bg-gray-200 p-4 w-full h-min self-center flex flex-col">
              <h1 className="text-2xl">
                Make To-Do List Shareable To Friends and Collaborators
              </h1>
              <p>
                Share your to-do list with your friends and collaborators,
                making collaboration easier
              </p>
            </div>
          </div>
          <div>
            <div className="w-1/2 flex-shrink-0 flex justify-center">
              <img
                src="/method-img/Private_Share_State.svg"
                alt=""
                className="self-center w-1/2"
              />
            </div>
            <div className="m-4 rounded-lg bg-gray-200 p-4 w-full h-min self-center">
              <h1 className="text-2xl">Check When complete</h1>
              <p>
                Check when your friends and collaborators complete the task,
                making you more efficient
              </p>
            </div>
          </div>

          <div>
            <div className="w-1/2 flex-shrink-0 flex justify-center">
              <img
                src="/method-img/Event_Notify.svg"
                alt=""
                className="self-center w-1/2"
              />
            </div>
            <div className="m-4 rounded-lg bg-gray-200 p-4  w-full h-min self-center">
              <h1 className="text-2xl">
                Quickly Check Events That Are Around the Corner
              </h1>
              <p>
                Quickly check the events that are near the end, so you won{"'"}t
                miss the deadline
              </p>
            </div>
          </div>

          <div>
            <div className="w-1/2 flex-shrink-0"></div>
            <div className="m-4 rounded-lg bg-gray-200 p-4 w-full">
              <h1 className="text-2xl">AI-Powered Suggestions</h1>
              <p>
                Get AI-powered suggestions to help you prioritize your tasks and
                improve productivity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router';

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
    <div className="flex flex-col w-full h-full text-white overflow-y-auto">
      {/* Hero Banner */}
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-8 gap-8 text-center bg-linear-to-b from-white/5 to-transparent">
        <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-5xl md:text-7xl font-bold text-green-500 drop-shadow-xl tracking-tight">
            Shareable Todo
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl leading-relaxed">
            Organize your tasks and collaborate with friends easily.
            <br className="hidden md:block" />
            Boost your productivity together.
          </p>
          <Link
            to="/login"
            className="mt-8 px-8 py-4 bg-green-600 hover:bg-green-500 text-white text-xl font-bold rounded-full transition-all hover:scale-105 shadow-xl hover:shadow-green-500/20 flex items-center gap-2"
          >
            Get Started
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>
      </div>

      <div className="h-full w-full flex flex-col *:flex *:flex-row max-md:*:flex-col child:child:max-md:w-full md:[&>*:nth-child(odd)]:flex-row-reverse *:m-4 ">
        <div>
          <div className="w-1/2 shrink-0 flex justify-center">
            <img
              src="/method-img/Share.svg"
              alt=""
              className="self-center w-1/2"
            />
          </div>
          <div className="m-4 rounded-lg bg-white/5 outline-1 outline-gray-400/40 p-4 w-full h-min self-center flex flex-col">
            <h1 className="text-2xl text-green-500 font-semibold mb-2">
              Make To-Do List Shareable To Friends and Collaborators
            </h1>
            <p className="text-gray-300">
              Share your to-do list with your friends and collaborators, making
              collaboration easier
            </p>
          </div>
        </div>
        <div>
          <div className="w-1/2 shrink-0 flex justify-center">
            <img
              src="/method-img/Private_Share_State.svg"
              alt=""
              className="self-center w-1/2"
            />
          </div>
          <div className="m-4 rounded-lg bg-white/5 outline-1 outline-gray-400/40 p-4 w-full h-min self-center">
            <h1 className="text-2xl text-green-500 font-semibold mb-2">
              Check When complete
            </h1>
            <p className="text-gray-300">
              Check when your friends and collaborators complete the task,
              making you more efficient
            </p>
          </div>
        </div>

        <div>
          <div className="w-1/2 shrink-0 flex justify-center">
            <img
              src="/method-img/Event_Notify.svg"
              alt=""
              className="self-center w-1/2"
            />
          </div>
          <div className="m-4 rounded-lg bg-white/5 outline-1 outline-gray-400/40 p-4 w-full h-min self-center">
            <h1 className="text-2xl text-green-500 font-semibold mb-2">
              Quickly Check Events That Are Around the Corner
            </h1>
            <p className="text-gray-300">
              Quickly check the events that are near the end, so you won{"'"}t
              miss the deadline
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

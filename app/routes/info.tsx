import { Link } from 'react-router';

export const meta = () => {
  return [
    {
      title: 'About Share TodoList',
      description:
        'Help you share your to-do list with your friends and collaborators',
    },
  ];
};

export default function Info() {
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
          <Link to="/" className="text-white text-xl">
            Info
          </Link>
        </div>
      </div>
      <div className="h-full w-full">
        <div className="flex justify-center">
          <div className="bg-red-600 p-4 rounded flex items-center gap-4">
            <strong className="text-3xl bg-white text-black p-2 rounded-full">
              !
            </strong>
            <p>This page is still under construction</p>
          </div>
        </div>
        <div className="items-center flex justify-center flex-col *:m-4">
          <p>Contact me:</p>
          <div className='*:p-2 *:bg-slate-700 *:rounded text-lg flex flex-row flex-wrap gap-4'>
            <a href="mailto:pika@mail.pikacnu.com">Mail</a>
            <div>
              Discord : pikacnu
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

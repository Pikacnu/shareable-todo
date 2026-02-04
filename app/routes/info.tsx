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
    <div className="flex flex-col w-full h-full text-white items-center justify-center p-4">
      <div className="max-w-2xl w-full flex flex-col gap-6">
        <div className="bg-white/5 outline-1 outline-gray-400/40 p-6 rounded-xl flex flex-col gap-4 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-green-500">Contact</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:pika@mail.pikacnu.com"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
            >
              <span>📧</span>
              <span>Mail</span>
            </a>
            <div className="px-4 py-2 bg-white/10 rounded-lg flex items-center gap-2 cursor-default">
              <span>💬</span>
              <span>Discord: pikacnu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

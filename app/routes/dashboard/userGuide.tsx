export const meta = () => {
  return [
    {
      title: 'User Guide - Dashboard',
      description: 'Learn how to use the shareable-todo app',
    },
  ];
};

export default function UserGuide() {
  return (
    <div className="w-full  h-full p-4 md:p-8 bg-slate-700 text-white flex flex-col items-center">
      <h1 className="text-3xl md:text-5xl font-bold mb-6">User Guide</h1>
    </div>
  );
}

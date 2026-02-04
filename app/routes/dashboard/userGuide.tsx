import {
  LayoutDashboard,
  CirclePlus,
  List,
  LogOut,
  FolderPlus,
} from 'lucide-react';

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
    <div className="w-full h-full max-h-screen p-4 md:p-8 bg-slate-700 text-white flex flex-col items-center overflow-y-auto">
      <div className="max-w-4xl w-full space-y-8 pb-20">
        {/* Header */}
        <header className="border-b border-gray-500 pb-4">
          <h1 className="text-3xl font-bold text-green-400">
            Project User Guide
          </h1>
          <p className="text-gray-300 mt-2">
            Welcome to Shareable Todo! This guide will help you manage your
            tasks effectively.
          </p>
        </header>

        {/* Navigation Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <LayoutDashboard className="text-green-400" />
            Navigation
          </h2>
          <div className="bg-white/10 rounded-xl p-4 space-y-4 backdrop-blur-sm">
            <p>
              The navigation bar is located on the side (desktop) or bottom
              (mobile). Use the icons to navigate:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                <LayoutDashboard className="text-green-400" />
                <span>
                  <strong>Dashboard:</strong> Overview of your activities.
                </span>
              </li>
              <li className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                <CirclePlus className="text-green-400" />
                <span>
                  <strong>Add Todo:</strong> Create new tasks.
                </span>
              </li>
              <li className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                <List className="text-green-400" />
                <span>
                  <strong>Todo Lists:</strong> Manage your lists and create new
                  ones.
                </span>
              </li>
              <li className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                <LogOut className="text-red-400" />
                <span>
                  <strong>Logout:</strong> Sign out of your account.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-green-400">
            Core Workflow
          </h2>

          {/* Step 1 */}
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-3 border-l-4 border-green-500 pl-3">
              1. Create a List
            </h3>
            <p className="mb-4 text-gray-300">
              Before adding tasks, you need a container (List) for them.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm md:text-base">
              <li>
                Navigate to the <strong>Todo Lists</strong> page{' '}
                <List className="inline w-4 h-4" />.
              </li>
              <li>
                Scroll to the bottom to find the "Create New Todo List" form.
              </li>
              <li>
                Enter a <strong>Title</strong> (e.g., "Work", "Groceries") and
                an optional Description.
              </li>
              <li>
                Click the{' '}
                <FolderPlus className="inline w-4 h-4 text-green-400" /> button
                to save.
              </li>
            </ol>
          </div>

          {/* Step 2 */}
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-3 border-l-4 border-green-500 pl-3">
              2. Add Tasks
            </h3>
            <p className="mb-4 text-gray-300">
              Once you have a list, you can populate it with tasks.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm md:text-base">
              <li>
                Navigate to the <strong>Add Todo</strong> page{' '}
                <CirclePlus className="inline w-4 h-4" />.
              </li>
              <li>
                Select the target <strong>List</strong> for your new task.
              </li>
              <li>Fill in the task details (Title, Description, Due Date).</li>
              <li>Set repetition or importance if needed.</li>
              <li>
                Click <strong>Add</strong> to create the task.
              </li>
            </ol>
          </div>

          {/* Step 3 */}
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-3 border-l-4 border-green-500 pl-3">
              3. Manage & Share
            </h3>
            <p className="mb-4 text-gray-300">View and track your progress.</p>
            <ul className="list-disc list-inside space-y-2 text-sm md:text-base">
              <li>
                Go to <strong>Todo Lists</strong> to see all your items.
              </li>
              <li>Click on a list to expand/collapse it.</li>
              <li>Check off items as you complete them.</li>
              <li>
                Use the Share feature (if available) to collaborate with others
                via a unique link.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

import { getTodoLists, getUserDataByRequest } from '~/function/getUserData';
import {
  useLoaderData,
  useFetcher,
  useNavigate,
  Link,
  LoaderFunctionArgs,
} from 'react-router';
import Calendar from '~/components/calendar';
import { Todo } from '~/components/tododroplist';
import { CircleDot, CircleDotDashed } from 'lucide-react';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userData = await getUserDataByRequest(request);
  const todoLists = await getTodoLists(userData.id);
  return {
    todolists: todoLists,
  };
};

export const meta = () => {
  return [
    {
      title: 'Dashboard',
      description: 'Dashboard',
    },
  ];
};

export default function Dashboard() {
  const { todolists } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const handleFinishChange = async (todoId: number, finished: boolean) => {
    const formData = new FormData();
    formData.append('id', todoId.toString());
    formData.append('finished', finished.toString());
    fetcher.submit(formData, {
      method: 'POST',
      action: '/api/todo/finish',
    });
  };

  const todoListData = todolists.reduce((acc, todoList) => {
    todoList.Todo.forEach((todo) => acc.push(todo));
    return acc;
  }, [] as Todo[]);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col lg:flex-row justify-between max-w-screen w-full h-full lg:h-[80vh] items-center relative overflow-y-auto lg:overflow-hidden grow">
      <div className="lg:m-4 grow flex flex-col lg:h-full h-full *:min-h-[30vh] relative max-lg:w-full w-1/3">
        <div className="flex flex-col w-full relative h-full max-lg:min-h-[50vh] min-h-[30vh]">
          <div className="w-full h-full relative lg:text-xl text-xs max-lg:*:rounded-none">
            <Calendar
              todoListData={todoListData}
              isRangeSelection={true}
              onSelectionFinished={(selection) => {
                if ('startDate' in selection && 'endDate' in selection) {
                  navigate(
                    `/dashboard/add?startDate=${selection.startDate.toISOString()}&endDate=${selection.endDate.toISOString()}`,
                  );
                } else if (Array.isArray(selection)) {
                  // Handle multiple selection dates if needed
                } else {
                  navigate(
                    `/dashboard/add?date=${selection.toISOString()}&isToday=true`,
                  );
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className="h-full text-white flex flex-col max-lg:grow max-lg:w-full w-1/3">
        {/* All Todo Lists */}
        <div className="bg-white/5 outline-1 outline-gray-400/40 grow overflow-y-auto lg:rounded-lg">
          {todolists.map((todoList) => {
            if (todoList.Todo.length === 0) return null;
            return (
              <div key={todoList.id} className="m-4 overflow-clip">
                <Link
                  to={`/dashboard/todolist?id=${todoList.id}`}
                  className="text-xl font-semibold underline-offset-4 underline mb-2 text-green-500"
                >
                  {todoList.title}
                </Link>
                <div className="flex flex-col gap-2 mt-2">
                  {todoList.Todo.map((todo) => (
                    <div
                      key={`todo-${todo.id}`}
                      className="flex flex-row bg-white/5 *:p-2 items-center relative rounded-lg outline-1 outline-gray-400/40"
                    >
                      <div className=" shrink grow">
                        <p className=" ml-2 text-ellipsis w-full overflow-hidden whitespace-nowrap max-w-[30vw] text-xl font-bold ">
                          {todo.title}
                        </p>
                        {todo.description && (
                          <p className="ml-2 max-w-[30vw] text-ellipsis w-full overflow-hidden whitespace-nowrap text-sm text-slate-400">
                            {todo.description}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-row shrink-0">
                        <input
                          type="checkbox"
                          id={`todo-${todo.id}-finish`}
                          checked={todo.finished}
                          onChange={() =>
                            handleFinishChange(todo.id, !todo.finished)
                          }
                          className="peer hidden"
                        />
                        <label
                          htmlFor={`todo-${todo.id}-finish`}
                          className={`ml-2 ${
                            todo.finished
                              ? 'text-green-600 bg-green-400/40'
                              : 'text-red-600 bg-red-400/40'
                          } peer-checked:text-green-600 select-none duration-200 transition-colors rounded-2xl p-1`}
                        >
                          {todo.finished ? <CircleDot /> : <CircleDotDashed />}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { getTodoLists, getUserDataByRequest } from '~/function/getUserData';
import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useFetcher, redirect } from '@remix-run/react';
import Calendar from '~/components/calendar';
import { Todo } from '~/components/tododroplist';

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

  return (
    <div className="flex flex-col lg:flex-row justify-between max-w-screen w-full h-screen lg:h-[80vh] items-center relative overflow-y-auto lg:overflow-hidden flex-grow">
      <div className="lg:m-4 flex-grow flex flex-col lg:h-full h-full *:min-h-[30vh] relative max-lg:w-full w-1/3">
        <div className="flex flex-col w-full relative h-full max-lg:min-h-[50vh] min-h-[30vh]">
          <div className="w-full h-full relative lg:text-xl text-xs max-lg:*:rounded-none">
            <Calendar
              isRangeSelection={true}
              todoListData={todoListData}
              onDateClick={(date) => {
                redirect(`/dashboard/add?date=${date.toISOString()}`);
              }}
            />
          </div>
        </div>
        <div className="flex flex-col lg:max-h-[30vh] h-full">
          {/* Upcoming todos within 2 days */}
          <div className="w-full h-full flex flex-col text-black overflow-y-auto *:m-4 lg:rounded-lg bg-stone-400 gap-2">
            {todoListData.map((todo) => {
              if (todo.finished) return null;
              if (
                new Date(todo.endTime || '').getTime() -
                  2 * 24 * 60 * 60 * 1000 >
                new Date().getTime()
              )
                return null;
              return (
                <div
                  key={todo.id}
                  className="flex flex-row bg-gray-400 *:p-2 items-center relative"
                >
                  <div className=" flex-shrink flex-grow">
                    <p className=" ml-2 text-ellipsis w-full overflow-hidden whitespace-nowrap max-w-[30vw] text-xl font-bold ">
                      {todo.title}
                    </p>
                    <p className="ml-2 max-w-[30vw] text-ellipsis w-full overflow-hidden whitespace-nowrap text-sm font-semibold">
                      {todo.description}
                    </p>
                  </div>
                  <div className="flex flex-row flex-shrink-0">
                    <input
                      type="checkbox"
                      id={`todo-${todo.id}-finish`}
                      checked={todo.finished}
                      onChange={() =>
                        handleFinishChange(todo.id, !todo.finished)
                      }
                    />
                    <label
                      htmlFor={`todo-${todo.id}-finish`}
                      className="select-none"
                    >
                      Finished?
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="h-full text-black flex flex-col max-lg:flex-grow max-lg:w-full w-1/3">
        {/* All Todo Lists */}
        <div className="bg-stone-400 flex-grow overflow-y-auto lg:rounded-lg">
          {todolists.map((todoList) => {
            if (todoList.Todo.length === 0) return null;
            return (
              <div key={todoList.id} className="m-4 overflow-clip">
                <h2 className="text-xl font-semibold">{todoList.title}</h2>
                <div className="flex flex-col gap-2">
                  {todoList.Todo.map((todo) => (
                    <div
                      key={`todo-${todo.id}`}
                      className="flex flex-row bg-gray-400 *:p-2 items-center relative"
                    >
                      <div className=" flex-shrink flex-grow">
                        <p className=" ml-2 text-ellipsis w-full overflow-hidden whitespace-nowrap max-w-[30vw] text-xl font-bold ">
                          {todo.title}
                        </p>
                        {todo.description && (
                          <p className="ml-2 max-w-[30vw] text-ellipsis w-full overflow-hidden whitespace-nowrap text-sm ">
                            {todo.description}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-row flex-shrink-0">
                        <input
                          type="checkbox"
                          id={`todo-${todo.id}-finish`}
                          checked={todo.finished}
                          onChange={() =>
                            handleFinishChange(todo.id, !todo.finished)
                          }
                        />
                        <label
                          htmlFor={`todo-${todo.id}-finish`}
                          className="select-none"
                        >
                          Finished?
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
      <div className="bg-black opacity-0 w-full hidden max-lg:block max-lg:flex-grow"></div>
    </div>
  );
}

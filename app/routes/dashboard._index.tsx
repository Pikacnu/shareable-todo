import { getTodoLists, getUserDataByRequest } from '~/function/getUserData';
import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useFetcher } from '@remix-run/react';
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
    <div className="flex flex-col lg:flex-row justify-between max-w-screen w-full h-screen lg:h-[80vh] items-center relative overflow-y-auto lg:overflow-hidden">
      <div className="lg:m-4 flex-grow flex flex-col lg:h-full h-full *:min-h-[30vh] relative [&>div>h1]:bg-gray-500 max-lg:w-[80vw] lg:[&>div>h1]:w-1/4 [&>div>h1]:m-2 [&>div>h1]:text-black [&>div>h1]:text-center [&>div>h1]:p-2 ">
        <div className="flex flex-col w-full relative h-full max-md:min-h-[50vh] md:min-h-[30vh]">
          <h1>calendar</h1>
          <div className="w-full h-full dark:bg-gray-600 bg-stone-400 relative lg:text-xl text-xs md:text-xl">
            <Calendar todoListData={todoListData} />
          </div>
        </div>
        <div className="flex flex-col lg:max-h-[30vh] h-full">
          <h1>{'Near End Todo'}</h1>
          <div className="w-full h-full dark:bg-gray-600 bg-stone-400 flex flex-col text-black overflow-y-auto *:m-4">
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
                    <div className="flex flex-col">
                      <p>Title : </p>
                      <p className=" ml-2 text-ellipsis w-full overflow-hidden whitespace-nowrap max-w-[30vw]">
                        {todo.title}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p>Description : </p>
                      <p className="ml-2 max-w-[30vw] text-ellipsis w-full overflow-hidden whitespace-nowrap">
                        {todo.description}
                      </p>
                    </div>
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
      <div className=" m-4 h-full w-[80vw] lg:w-[40vw] text-black flex flex-col">
        <h1 className="bg-slate-500 m-2 p-2 w-1/4 text-center">Todos</h1>
        <div className="dark:bg-gray-600 bg-stone-400 flex-grow overflow-y-auto">
          {todolists.map((todoList) => {
            if (todoList.Todo.length === 0) return null;
            return (
              <div key={todoList.id} className="m-4 overflow-clip">
                <h2 className="text-xl">{todoList.title}</h2>
                <div className="flex flex-col gap-2">
                  {todoList.Todo.map((todo) => (
                    <div
                      key={`todo-${todo.id}`}
                      className="flex flex-row bg-gray-400 *:p-2 items-center relative"
                    >
                      <div className=" flex-shrink flex-grow">
                        <div className="flex flex-col">
                          <p>Title : </p>
                          <p className=" ml-2 text-ellipsis w-full overflow-hidden whitespace-nowrap max-w-[30vw]">
                            {todo.title}
                          </p>
                        </div>
                        {todo.description && (
                          <div className="flex flex-col">
                            <p>Description : </p>
                            <p className="ml-2 max-w-[30vw] text-ellipsis w-full overflow-hidden whitespace-nowrap">
                              {todo.description}
                            </p>
                          </div>
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
      <div className="bg-black opacity-0 w-full hidden max-lg:block">
        <p className="max-lg:h-16"></p>
      </div>
    </div>
  );
}

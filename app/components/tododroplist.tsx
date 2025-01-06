import { useFetcher } from '@remix-run/react';
import { useState } from 'react';
import TodoListEdit from './todolist';

export type TodoListInfo = {
  id: number;
  title: string;
};

export enum ShareStatus {
  Private = 'private',
  Public = 'public',
}

export type Todo = {
  id: number;
  title: string;
  description: string;
  isToday: boolean;
  datetime: string;
  finished: boolean;
  startTime?: string;
  endTime?: string;
  preview?: boolean;
};

export type TodoList = TodoListInfo & {
  Todo: Todo[];
  shareStatus: ShareStatus;
};

export type TodoListWithListInfo = TodoList & {
  isOwner: boolean;
  shareId: string;
};

export function DropList({
  todoList,
  url,
}: {
  todoList: TodoListWithListInfo[];
  url: string;
}) {
  //const fetcher = useFetcher();
  const [todoOpenState, setTodoOpenState] = useState<
    {
      todoListID: number;
      isOpen: boolean;
    }[]
  >(todoList.map((todoList) => ({ todoListID: todoList.id, isOpen: false })));
  const Fetcher = useFetcher();
  return (
    <div className="flex flex-col h-full justify-start lg:w-full text-xs md:text-lg lg:text-xl">
      {todoList.map((todoList) => {
        const isOpen = todoOpenState.find(
          (todoOpenState) => todoOpenState.todoListID === todoList.id,
        )?.isOpen;
        return (
          <div
            key={todoList.id}
            className="flex flex-col lg:justify-between m-4 bg-slate-700"
          >
            <div className="flex flex-row justify-between items-center">
              <TodoListEdit
                className=" flex-grow flex *:ml-4 items-center"
                id={todoList.id}
                defaulttitle={todoList.title}
                isOwner={todoList.isOwner}
              ></TodoListEdit>
              <div className="*:p-2 *:rounded-3xl">
                <button
                  onClick={() => {
                    setTodoOpenState((prev) => {
                      return prev
                        .filter((state) => state.todoListID !== todoList.id)
                        .concat({ todoListID: todoList.id, isOpen: !isOpen });
                    });
                  }}
                >
                  {!isOpen ? 'Open' : 'Close'}
                </button>
                {todoList.shareStatus === ShareStatus.Public ? (
                  <button
                    onClick={() => {
                      if (!todoList.shareId) {
                        const formData = new FormData();
                        formData.append('list_id', todoList.id.toString());
                        Fetcher.submit(formData, {
                          action: '/api/share',
                          method: 'POST',
                        });
                        return;
                      }
                      if (navigator) {
                        navigator.clipboard.writeText(
                          `${url}/share/${todoList.shareId}`,
                        );
                        alert('copy to your clipboard');
                      }
                    }}
                  >
                    Share
                  </button>
                ) : (
                  ''
                )}
                {todoList.isOwner ? (
                  <button
                    onClick={() => {
                      const formData = new FormData();
                      formData.append('id', todoList.id.toString());
                      formData.append('type', 'shareStatus');
                      formData.append('shareStatus', todoList.shareStatus);
                      Fetcher.submit(formData, {
                        method: 'PUT',
                        action: '/api/todoList',
                      });
                    }}
                  >
                    {todoList.shareStatus === ShareStatus.Public
                      ? 'Public'
                      : 'Private'}
                  </button>
                ) : null}

                <button
                  className="bg-red-600"
                  onClick={() => {
                    const formData = new FormData();
                    formData.append('id', todoList.id.toString());
                    Fetcher.submit(formData, {
                      method: 'DELETE',
                      action: '/api/todoList',
                    });
                  }}
                >
                  {todoList.isOwner ? 'Delete' : 'Leave'}
                </button>
              </div>
            </div>
            <div
              className={`flex flex-col ${
                isOpen ? 'flex' : 'hidden'
              } bg-slate-500 lg:m-4`}
              hidden={!isOpen}
            >
              {todoList.Todo.length === 0 ? (
                <div className="text-xl text-center">Nothing Here</div>
              ) : (
                todoList.Todo.map((todo) => {
                  return (
                    <div
                      key={todo.id}
                      className="flex flex-row justify-between items-center relative"
                    >
                      <div className="flex flex-row justify-around *:m-2 items-center overflow-hidden *:overflow-clip max-lg:*:max-w-36">
                        <h1 className="bg-gray-700 p-2">{todo.title}</h1>
                        <p className="bg-gray-700 p-2">{todo.description}</p>
                        <p>
                          {todo.isToday
                            ? (() => {
                                const dDate =
                                  new Date().getDate() -
                                  new Date(todo.datetime).getDate();
                                if (dDate === 0) {
                                  return 'Today';
                                } else if (dDate >= 1) {
                                  return `${dDate} day ago`;
                                }
                                return `${-dDate} days after`;
                                // eslint-disable-next-line no-mixed-spaces-and-tabs
                              })()
                            : todo.datetime.slice(0, 10)}
                        </p>
                      </div>
                      <div className="flex flex-row m-2 *:ml-4">
                        <button
                          className={` select-none ${
                            todo.finished ? ' bg-green-500' : 'bg-red-500'
                          } p-2 rounded-lg`}
                          onClick={() => {
                            const formData = new FormData();
                            formData.append('id', todo.id.toString());
                            formData.append(
                              'finished',
                              todo.finished ? 'false' : 'true',
                            );
                            Fetcher.submit(formData, {
                              method: 'POST',
                              action: '/api/todo/finish',
                            });
                          }}
                        >
                          {todo.finished ? 'Finish' : 'working'}
                        </button>
                        {todoList.isOwner ? (
                          <button
                            className={`select-none ${'bg-red-500'} p-2 rounded-lg`}
                            onClick={() => {
                              const formData = new FormData();
                              formData.append('id', todo.id.toString());
                              Fetcher.submit(formData, {
                                method: 'DELETE',
                                action: '/api/todo',
                              });
                            }}
                          >
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

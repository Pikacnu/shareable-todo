import { useState } from 'react';

export type TodoListInfo = {
	id: number;
	title: string;
	description: string;
};

export enum ShareStatus {
	Private,
	Public,
}

export type Todo = {
	id: number;
	title: string;
	description: string;
	isToday: boolean;
	datetime: string;
	finished: boolean;
};

export type TodoList = TodoListInfo & {
	Todo: Todo[];
  shareStatus: ShareStatus;
};

export function DropList({ todoList }: { todoList: TodoList[] }) {
	//const fetcher = useFetcher();
	const [todoOpenState, setTodoOpenState] = useState<
		{
			todoListID: number;
			isOpen: boolean;
		}[]
	>(todoList.map((todoList) => ({ todoListID: todoList.id, isOpen: false })));
	return (
		<div className='flex flex-col h-full justify-start'>
			{todoList.map((todoList) => {
				const isOpen = todoOpenState.find(
					(todoOpenState) => todoOpenState.todoListID === todoList.id,
				)?.isOpen;
				return (
					<div
						key={todoList.id}
						className='flex flex-col justify-between m-4 bg-slate-700'
					>
						<div className='flex flex-row justify-between items-center'>
							<div className='flex *:ml-4 items-center'>
								<h1 className='text-2xl'>{todoList.title}</h1>
								<p className='overflow-hidden text-ellipsis'>
									{todoList.description}
								</p>
							</div>
							<div className='*:p-2 *:rounded-3xl'>
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
								<button onClick={() => {}}>Edit</button>
                <button>Share</button>
                <button>{todoList.shareStatus===ShareStatus.Public?'Public':'Private'}</button>
								<button
									className='bg-red-600'
									onClick={() => {}}
								>
									Delete
								</button>
							</div>
						</div>
						<div
							className={`flex flex-col ${
								isOpen ? 'flex' : 'hidden'
							} bg-slate-500 m-4`}
							hidden={!isOpen}
						>
							{todoList.Todo.map((todo) => {
								return (
									<div
										key={todo.id}
										className='flex flex-row justify-between items-center'
									>
										<div className='flex flex-row justify-around *:m-4'>
											<h1>{todo.title}</h1>
											<p>{todo.description}</p>
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
													: todo.datetime}
											</p>
										</div>
										<div className='flex flex-row m-2'>
											<button
												className={` select-none ${
													todo.finished ? ' bg-green-500' : 'bg-red-500'
												} p-2 rounded-lg`}
												onClick={() => {

                        }}
											>
												{todo.finished ? 'Finish' : 'working'}
											</button>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				);
			})}
		</div>
	);
}

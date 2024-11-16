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
};

export type TodoList = TodoListInfo & {
	Todo: Todo[];
	shareStatus: ShareStatus;
};

export type TodoListWithOwnerInfo = TodoList & {
	isOwner: boolean;
}

export function DropList({ todoList }: { todoList: TodoListWithOwnerInfo[] }) {
	//const fetcher = useFetcher();
	const [todoOpenState, setTodoOpenState] = useState<
		{
			todoListID: number;
			isOpen: boolean;
		}[]
	>(todoList.map((todoList) => ({ todoListID: todoList.id, isOpen: false })));
	const Fetcher = useFetcher();
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
							<TodoListEdit
								className=' flex-grow flex *:ml-4 items-center'
								id={todoList.id}
								defaulttitle={todoList.title}
								isOwner={todoList.isOwner}
							></TodoListEdit>
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
								{todoList.shareStatus === ShareStatus.Public ? (
									<button>Share</button>
								) : (
									''
								)}
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
								<button
									className='bg-red-600'
									onClick={() => {
										const formData = new FormData();
										formData.append('id', todoList.id.toString());
										Fetcher.submit(formData, {
											method: 'DELETE',
											action: '/api/todoList',
										});
									}}
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
							{todoList.Todo.length === 0 ? (
								<div className='text-2xl text-center'>Nothing Here</div>
							) : (
								todoList.Todo.map((todo) => {
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
													onClick={() => {}}
												>
													{todo.finished ? 'Finish' : 'working'}
												</button>
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

import { getTodoLists, getUserDataByRequest } from '~/function/getUserData';
import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

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
		},
	];
};

export default function Dashboard() {
	const { todolists } = useLoaderData<typeof loader>();
	return (
		<div className='flex flex-row justify-between w-full h-[80vh] items-center relative'>
			<div className=' m-4 flex-grow flex flex-col h-full *:h-1/2 *:m-4 relative [&>div>h1]:bg-gray-500 [&>div>h1]:w-1/4 [&>div>h1]:m-2 [&>div>h1]:text-black [&>div>h1]:text-center [&>div>h1]:p-2 '>
				<div className='flex flex-col'>
					<h1>calendar</h1>
					<div className='w-full h-full bg-white'></div>
				</div>
				<div className='flex flex-col'>
					<h1>events</h1>
					<div className='w-full h-full bg-white'></div>
				</div>
			</div>
			<div className=' m-4 h-full w-[40%] text-black flex flex-col'>
				<h1 className='bg-slate-500 m-2 p-2 w-1/4 text-center '>Todos</h1>
				<div className='bg-white flex-grow'>
					{todolists.map((todoList) => {
						if (todoList.Todo.length === 0) return null;
						return (
							<div
								key={todoList.id}
								className='m-4'
							>
								<h2 className='text-xl'>{todoList.title}</h2>
								{todoList.Todo.map((todo) => (
									<div
										key={`todo-${todo.id}`}
										className='flex flex-row bg-gray-200 *:p-2 items-center'
									>
										<div className='flex flex-row justify-between flex-grow'>
											<p>Title : {todo.title}</p>
											<p>{todo.description}</p>
										</div>
										<div className='flex flex-row'>
											<input
												type='checkbox'
												id={`todo-${todo.id}-finish`}
											/>
											<label
												htmlFor={`todo-${todo.id}-finish`}
												className='select-none'
											>
												Finished?
											</label>
										</div>
									</div>
								))}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

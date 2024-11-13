import { useState } from 'react';
import { useFetcher } from 'react-router-dom';

export const meta = () => {
	return [
		{
			title: 'Dashboard - Add Todo',
		},
	];
};

interface TodoListInfo {
	id: number;
	title: string;
	description: string;
}

export default function Add() {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [isToday, setIsToday] = useState(false);
	const [selectedItems, setSelectedItems] = useState<TodoListInfo[]>([]);
	const [selectIndex, setSelectIndex] = useState(0);
	const [startDatetime, setStartDatetime] = useState(
		new Date().toISOString().slice(0, 16),
	);
	const [endDatetime, setEndDatetime] = useState(
		new Date().toISOString().slice(0, 16),
	);
	const addTodo = useFetcher();
	const submit = (
		title: string,
		description: string,
		isToday: boolean,
		startDatetime: string,
		endDatetime: string,
		selectedItems: TodoListInfo[],
	) => {
		if (title.length < 3)
			return alert('Title must be at least 3 characters long');
		const formData = new FormData();
		Object.entries({
			title,
			description,
			isToday,
			startDatetime,
			endDatetime,
			selectedItems,
		}).forEach(([key, value]) => {
			formData.append(key, value.toString());
		});
		addTodo.submit(formData, { method: 'post', action: '/api/todo' });
	};
	const clearTempData = () => {
		setTitle('');
		setDescription('');
		setIsToday(false);
		setSelectedItems([]);
		setSelectIndex(0);
		setStartDatetime(new Date().toISOString().slice(0, 16));
		setEndDatetime(new Date().toISOString().slice(0, 16));
	};

	const todolists: TodoListInfo[] = [
		{
			id: 1,
			title: 'List 1',
			description: 'List 1 description',
		},
		{
			id: 2,
			title: 'List 2',
			description: 'List 2 description',
		},
		{
			id: 3,
			title: 'List 3',
			description: 'List 3 description',
		},
	];

	return (
		<div className='flex flex-row w-full m-4 h-[80vh] justify-between *:w-1/2 *:m-4'>
			<div className='flex flex-col p-8 bg-slate-500  rounded-xl justify-between'>
				<div>
					<div className='flex flex-col *:m-2 h-full'>
						<input
							type='text'
							placeholder='Title'
							value={title}
							minLength={3}
							onChange={(e) => setTitle(e.target.value)}
						/>
						<textarea
							placeholder='Description'
							className=' resize-none h-[60%]'
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
						<div className='flex *:m-2'>
							<input
								type='checkbox'
								id='Today'
								name='Today'
								checked={isToday}
								onChange={(e) => setIsToday(e.target.checked)}
							/>
							<label
								htmlFor='Today'
								className=' select-none'
							>
								Is only for today?
							</label>
						</div>
						<div
							className={
								'flex space-x-3 justify-center flex-wrap items-center ' + (isToday ? ' hidden' : '')
							}
						>
							<div>
								<label htmlFor='startDateTime'>Start Date</label>
								<input
									disabled={isToday}
									type='datetime-local'
									name='startDateTime'
									value={startDatetime}
									onChange={(e) => setStartDatetime(e.target.value)}
								/>
							</div>
							<div>
								<label htmlFor='endDateTime'>End Date</label>
								<input
									disabled={isToday}
									type='datetime-local'
									name='endDateTime'
									value={startDatetime}
									onChange={(e) => setEndDatetime(e.target.value)}
								/>
							</div>
						</div>
					</div>
					<div className='flex flex-col'>
						<label htmlFor='select-affectlist'>Affect Lists</label>
						<select
							id='select-affectlist'
							value={selectIndex}
							onChange={(e) => {
								setSelectIndex(Number(e.target.value));
							}}
						>
							<option
								value='none'
								id='option'
							>
								select todo list
							</option>
							{todolists
								.filter(
									(item) => !selectedItems.some((list) => list.id === item.id),
								)
								.map((list) => (
									<option
										key={list.id}
										value={list.id}
									>
										{list.title}
									</option>
								))}
						</select>
						<button
							onClick={(e) => {
								e.preventDefault();
								const selectedList = todolists.find(
									(item) => item.id === selectIndex,
								);
								setSelectIndex(0);
								if (selectedItems.some((item) => item.id === selectedList?.id))
									return;
								if (selectedList) {
									setSelectedItems([...selectedItems, selectedList]);
								}
							}}
						>
							Add!
						</button>
						<p className='m-2'>
							Lists are the collections of events. You can add events to lists
							to
							<div className='*:m-2'>
								{selectedItems.map((list) => (
									<div
										key={list.id}
										className=' flex flex-row justify-between'
									>
										<p>
											{list.title} - {list.description}
										</p>
										<button
											onClick={() => {
												setSelectedItems(
													selectedItems.filter((item) => item.id !== list.id),
												);
											}}
										>
											x
										</button>
									</div>
								))}
							</div>
						</p>
					</div>
				</div>
				<div className='bg-white text-black flex flex-row justify-between *:m-2 rounded-lg p-2'>
					<button
						onClick={() => {
							submit(
								title,
								description,
								isToday,
								startDatetime,
								endDatetime,
								selectedItems,
							);
							clearTempData();
						}}
					>
						add
					</button>
					<button
						onClick={() =>
							submit(
								title,
								description,
								isToday,
								startDatetime,
								endDatetime,
								selectedItems,
							)
						}
					>
						add others with same option
					</button>
				</div>
			</div>
			<div className='flex flex-col w-full'>
				<h1>Todo</h1>
				<div className='w-full h-full bg-white'></div>
			</div>
		</div>
	);
}

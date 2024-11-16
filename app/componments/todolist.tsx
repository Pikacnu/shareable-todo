import { useState } from 'react';
import { useFetcher } from 'react-router-dom';

interface TodoListInfo {
	id: number;
	defaulttitle: string;
	className?: string;
	isOwner?: boolean;
}

export default function TodoListEdit({
	id,
	defaulttitle,
	className,
	isOwner,
}: TodoListInfo) {
	const Fetcher = useFetcher();
	const [isEditing, setIsEditing] = useState(false);
	const [title, setTitle] = useState(defaulttitle);
	return (
		<div className={'flex justify-between ' + className}>
			<input
				className='text-2xl'
				type='text'
				disabled={!isEditing}
				onChange={(e) => setTitle(e.target.value)}
				value={title}
			></input>
			{isOwner === undefined || !isOwner ? null : (
				<button className='p-2 '
					onClick={() => {
						if (isEditing) {
							if (defaulttitle === title) return setIsEditing(false);
							const formData = new FormData();
							formData.append('id', id.toString());
							formData.append('title', title);
							formData.append('description', '');
							formData.append('type', 'updateInfo');
							Fetcher.submit(formData, {
								action: '/api/todolist',
								method: 'PUT',
							});
						}
            setIsEditing(!isEditing);
					}}
				>
					{isEditing ? 'Save' : 'Edit'}
				</button>
			)}
		</div>
	);
}

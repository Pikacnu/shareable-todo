import { DropList, ShareStatus } from '~/componments/tododroplist';

export default function TodoLists() {
	return (
		<div className='w-full h-full '>
			<DropList
				todoList={[
					{
						id: 1,
						title: 'List 1',
						description: 'List 1 description',
						Todo: [
							{
								id: 1,
								title: 'Todo 1',
								description: 'Todo 1 description',
								isToday: true,
								datetime: '2024/10/1',
								finished: false,
							},
						],
						shareStatus: ShareStatus.Private,
					},
					{
						id: 2,
						title: 'List 2',
						description: 'List 2 description',
						Todo: [
							{
								id: 1,
								title: 'Todo 1',
								description: 'Todo 1 description',
								isToday: true,
								datetime: '2024/10/14',
								finished: true,
							},
						],
						shareStatus: ShareStatus.Public,
					},
				]}
			/>
		</div>
	);
}

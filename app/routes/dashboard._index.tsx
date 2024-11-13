
export const meta = () => {
	return [
		{
			title: 'Dashboard',
		},
	];
};

export default function Dashboard() {
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
				<h1 className="bg-slate-500 m-2 p-2 w-1/4 text-center ">Todos</h1>
				<div className="bg-white flex-grow">
					
				</div>
			</div>
		</div>
	);
}

import { Link } from '@remix-run/react';

export default function Index() {
	return (
		<div className='flex flex-col w-full h-full'>
			<img src="" alt="" className=' object-cover h-1/5 w-full'/>
			<div className=' bg-gray-600 flex-grow'>
				<h1 className='text-2xl text-center text-white p-4'>
					Welcome to the Todo App
				</h1>
				<div className='flex flex-row justify-around p-4 *:flex-grow *:text-center'>
					<Link to='/login' className='text-white text-xl'>
						Login
					</Link>
					<Link to='/' className='text-white text-xl'>
						Info
					</Link>
				</div>
			</div>
		</div>
	);
}

import { Link } from '@remix-run/react';

export default function Index() {
	return (
		<div className='flex flex-col w-full h-full'>
			<div className='flex flex-row justify-around p-4 *:flex-grow *:text-center bg-gray-600'>
				<Link
					to='/login'
					className='text-white text-xl'
				>
					Login
				</Link>
				<Link
					to='/'
					className='text-white text-xl'
				>
					Info
				</Link>
			</div>
			<div className='h-full w-full'>
				<div className='h-full w-full bg-gradient-to-b from-transparent from-10% to-gray-600'>
					<h1 className='text-4xl text-center text-white p-4 bg-clip-text bg-gradient-to-l from-orange-500 to-white'>
						Welcome to Shareable Todo App
					</h1>
				</div>
			</div>
		</div>
	);
}

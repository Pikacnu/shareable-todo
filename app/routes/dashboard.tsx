import { LoaderFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';
import { Outlet, Link } from '@remix-run/react';

export const loader = ({ request }: LoaderFunctionArgs) => {
	return authenticator.isAuthenticated(request, {
		failureRedirect: '/login',
	});
};

export default function Dashboard() {
	return (
		<div className='flex flex-col lg:flex-row w-full h-full items-center justify-around overflow-hidden'>
			<div className='flex lg:flex-grow m-4 '>
				<Outlet />
			</div>
			<div className='m-4 p-4 absolute lg:relative w-2/3 lg:w-auto bottom-0 lg:h-[80%] bg-white rounded-3xl text-black flex flex-row lg:flex-col justify-between'>
				<div className='flex flex-row lg:flex-col items-center *:ml-2 lg:*:ml-0 lg:*:mt-4'>
					<Link to={'/dashboard'}>Dashboard</Link>
					<Link to={'/dashboard/add'}>Add</Link>
					<Link to={'/dashboard/todoLists'}>Todo</Link>
				</div>
				<div>
					<Link to={'/logout'}>Logout</Link>
				</div>
			</div>
		</div>
	);
}

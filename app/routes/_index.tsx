import { Link } from '@remix-run/react';

export default function Index() {
	return (
		<div className='flex flex-col'>
			<div className=''>
				<Link to={'/login'}>login </Link>
			</div>
		</div>
	);
}

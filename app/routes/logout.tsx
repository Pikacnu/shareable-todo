import { Form } from '@remix-run/react';

export default function loader() {
	return (
		<div className='flex w-full h-screen items-center justify-center'>
			<Form action='/auth/logout' method='POST' className=' shadow-lg p-4 m-4 rounded-3xl bg-gray-500'>
				<button type='submit'>Logout</button>
			</Form>
		</div>
	);
}

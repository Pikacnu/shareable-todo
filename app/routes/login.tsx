import { LoaderFunctionArgs } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { authenticator } from '~/services/auth.server';
import { AuthType } from '~/services/auth.type';

function LoginWith({ providor }: { providor: AuthType }) {
	return (
		<Form
			method='POST'
			action={`/auth/${providor}`}
		>
			<button type='submit'>Login with {providor}</button>
		</Form>
	);
}

export function loader({ request }: LoaderFunctionArgs) {
	return authenticator.isAuthenticated(request, {
		successRedirect: '/dashboard',
	});
}

export default function Login() {
	return (
		<div className='flex flex-col *:m-2 rounded-2xl m-16 shadow-sm shadow-gray-800 bg-gray-800 min-w-[30%] min-h-[80%] items-center'>
			<h1 className=' text-2xl'>Login</h1>
			<div>{LoginWith({ providor: AuthType.Discord })}</div>
		</div>
	);
}

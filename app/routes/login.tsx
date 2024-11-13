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

export function loader({ request }:LoaderFunctionArgs) {
	return authenticator.isAuthenticated(request, {
		successRedirect: '/dashboard',
	});
}

export default function Login() {
	return (
		<div className='flex flex-col *:m-2 rounded-2xl m-16 shadow-sm shadow-gray-800 bg-gray-800'>
			<h1>Login</h1>
			{LoginWith({ providor: AuthType.Discord })}
		</div>
	);
}

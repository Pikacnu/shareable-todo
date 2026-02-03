import { ActionFunctionArgs, redirect } from 'react-router';
import { authenticator } from '~/services/auth.server';

export function loader() {
  return redirect('/login');
}

export function action({ request }: ActionFunctionArgs) {
	return authenticator.logout(request, {
		redirectTo: '/login',
	});
}

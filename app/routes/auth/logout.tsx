import { ActionFunctionArgs, redirect } from 'react-router';
import { logout } from '~/services/auth/auth.server';

export function loader() {
  return redirect('/login');
}

export function action({ request }: ActionFunctionArgs) {
  return logout(request);
}

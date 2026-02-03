import { ActionFunctionArgs, redirect } from 'react-router';
import { authenticator } from '~/services/auth.server';

export const loader = () => redirect('/login');

export const action = ({ request, params }: ActionFunctionArgs) => {
	return authenticator.authenticate(params.providor!, request, {
		failureRedirect: '/auth/failure',
	});
};

import { authenticator } from '~/services/auth.server';
import { LoaderFunctionArgs } from 'react-router';

export const loader = ({ request, params }: LoaderFunctionArgs) => {
	return authenticator.authenticate(params.providor!, request, {
		failureRedirect: '/auth/failure',
    successRedirect: '/dashboard',
	});
};

import { ActionFunctionArgs } from '@remix-run/node';
import { getUserDataByRequest } from '~/function/getUserData';
import { db } from '~/services/db.server';
import { list, ShareID } from 'db/schema';
import { and, eq } from 'drizzle-orm';
import { ShareStatus } from '~/componments/tododroplist';
import { v4 } from 'uuid';

export const action = async ({ request }: ActionFunctionArgs) => {
	const from = await request.formData();
	const id = parseInt((from.get('list_id') as string) || '');
	if (!id || isNaN(id)) return new Response('Bad Request', { status: 400 });
	const userInfo = await getUserDataByRequest(request);
	if (!userInfo) return new Response('Unauthorized', { status: 401 });
	const listinfo = (
		await db
			.select()
			.from(list)
			.where(
				and(
					and(eq(list.owner_id, userInfo.id), eq(list.id, id)),
					eq(list.shareStatus, ShareStatus.Public),
				),
			)
	)[0];
	if (!listinfo) return new Response('Forbidden', { status: 403 });
	const share_id = await db
		.insert(ShareID)
		.values({
			list_id: listinfo.id,
			share_id: v4(),
		})
		.onConflictDoNothing()
		.returning({
			id: ShareID.share_id,
		});
	return share_id;
};

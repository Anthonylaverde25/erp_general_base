import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const PartnersPage = lazy(() => import('@/ui/partners/pages/PartnersPage'));
const PartnerProfilePage = lazy(() => import('@/ui/partners/pages/PartnerProfilePage'));
const CreatePartnerPage = lazy(() => import('@/ui/partners/pages/CreatePartnerPage'));

/**
 * The Partners page route.
 */
const route: FuseRouteItemType = {
	path: 'partners',
	children: [
		{
			path: '',
			element: <PartnersPage />
		},
		{
			path: 'create',
			element: <CreatePartnerPage />
		},
		{
			path: ':id',
			element: <PartnerProfilePage />
		}
	]
};

export default route;


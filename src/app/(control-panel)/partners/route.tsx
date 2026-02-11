import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const PartnersPage = lazy(() => import('@/ui/partners/pages/PartnersPage'));

/**
 * The Partners page route.
 */
const route: FuseRouteItemType = {
	path: 'partners',
	element: <PartnersPage />
};

export default route;

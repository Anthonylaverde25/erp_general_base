import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const BatchesPage = lazy(() => import('@/ui/batches/pages/BatchesPage'));

const route: FuseRouteItemType = {
	path: 'inventory/batches',
	element: <BatchesPage />
};

export default route;

import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const SuppliersInventoryPage = lazy(() => import('@/ui/inventory/pages/SuppliersInventoryPage'));

const route: FuseRouteItemType = {
	path: 'inventory/suppliers',
	element: <SuppliersInventoryPage />
};

export default route;

import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

import ModuleGuard from '@/components/guards/ModuleGuard';

const SuppliersInventoryPage = lazy(() => import('@/ui/inventory/pages/SuppliersInventoryPage'));

const route: FuseRouteItemType = {
	path: 'inventory/suppliers',
	element: (
		<ModuleGuard module={['sales', 'purchases']}>
			<SuppliersInventoryPage />
		</ModuleGuard>
	)
};

export default route;

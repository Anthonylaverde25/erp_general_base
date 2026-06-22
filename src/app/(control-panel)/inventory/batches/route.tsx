import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

import ModuleGuard from '@/components/guards/ModuleGuard';

const BatchesPage = lazy(() => import('@/ui/batches/pages/BatchesPage'));

const route: FuseRouteItemType = {
	path: 'inventory/batches',
	element: (
		<ModuleGuard module={['sales', 'purchases']}>
			<BatchesPage />
		</ModuleGuard>
	)
};

export default route;

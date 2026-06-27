import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

import ModuleGuard from '@/components/guards/ModuleGuard';

const SerialReturnsPage = lazy(() => import('@/ui/serial-returns/pages/SerialReturnsPage'));

const route: FuseRouteItemType = {
	path: 'inventory/serial-returns',
	element: (
		<ModuleGuard module={['sales', 'purchases']}>
			<SerialReturnsPage />
		</ModuleGuard>
	)
};

export default route;

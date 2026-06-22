import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

import ModuleGuard from '@/components/guards/ModuleGuard';

const StockMovementsPage = lazy(() => import('@/ui/stock-movements/pages/StockMovementsPage'));

const route: FuseRouteItemType = {
	path: 'inventory/stock-movements',
	element: (
		<ModuleGuard module={['sales', 'purchases']}>
			<StockMovementsPage />
		</ModuleGuard>
	)
};

export default route;

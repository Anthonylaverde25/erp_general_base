import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const StockMovementsPage = lazy(() => import('@/ui/stock-movements/pages/StockMovementsPage'));

const route: FuseRouteItemType = {
	path: 'inventory/stock-movements',
	element: <StockMovementsPage />
};

export default route;

import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

import ModuleGuard from '@/components/guards/ModuleGuard';

const DeliveryView = lazy(() => import('@/ui/delivery/pages/DeliveryView'));
const RouteListPage = lazy(() => import('@/ui/delivery/pages/RouteListPage'));
const RouteHistoryPage = lazy(() => import('@/ui/delivery/pages/RouteHistoryPage'));

/**
 * The Delivery page route.
 */
const route: FuseRouteItemType = {
	path: 'delivery',
	element: <ModuleGuard module="sales" />,
	children: [
		{
			path: 'route-list',
			element: <RouteListPage />
		},
		{
			path: 'route-history',
			element: <RouteHistoryPage />
		},
		{
			path: ':code?',
			element: <DeliveryView />
		}
	]
};

export default route;

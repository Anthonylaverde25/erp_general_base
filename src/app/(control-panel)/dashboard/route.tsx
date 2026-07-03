import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
const DashboardView = lazy(() => import('@/ui/dashboard/components/views/DashboardView'));
/**
 * The Dashboard page route.
 */
const route: FuseRouteItemType = {
	path: 'dashboard',
	element: <DashboardView />

  
};

export default route;

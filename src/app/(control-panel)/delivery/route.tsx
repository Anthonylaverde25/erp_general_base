import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const DeliveryView = lazy(() => import('./components/views/DeliveryView'));

/**
 * The Delivery page route.
 */
const route: FuseRouteItemType = {
	path: 'delivery',
	element: <DeliveryView />
};

export default route;

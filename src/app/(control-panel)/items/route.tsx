import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const ItemsPage = lazy(() => import('@/ui/items/pages/ItemsPage'));

/**
 * The Items page route.
 */
const route: FuseRouteItemType = {
    path: 'items',
    children: [
        {
            path: '',
            element: <ItemsPage />
        }
    ]
};

export default route;

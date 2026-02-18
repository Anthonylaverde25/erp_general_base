import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const ItemsPage = lazy(() => import('@/ui/items/pages/ItemsPage'));
const CreateItemPage = lazy(() => import('@/ui/items/pages/CreateItemPage'));

/**
 * The Items page route.
 */
const route: FuseRouteItemType = {
    path: 'items',
    children: [
        {
            path: '',
            element: <ItemsPage />
        },
        {
            path: 'create',
            element: <CreateItemPage />
        }
    ]
};

export default route;

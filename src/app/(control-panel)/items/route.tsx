import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const ItemsPage = lazy(() => import('@/ui/items/pages/ItemsPage'));
const CreateItemPage = lazy(() => import('@/ui/items/pages/CreateItemPage'));
const UpdateItemPage = lazy(() => import('@/ui/items/pages/UpdateItemPage'));
const ItemDetailPage = lazy(() => import('@/ui/items/pages/ItemDetailPage'));

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
			path: 'products',
			element: <ItemsPage />
		},
		{
			path: 'services',
			element: <ItemsPage />
		},
		{
			path: 'create',
			element: <CreateItemPage />
		},
		{
			path: ':id/edit',
			element: <UpdateItemPage />
		},
		{
			path: ':id',
			element: <ItemDetailPage />
		}
	]
};

export default route;

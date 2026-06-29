import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

import ModuleGuard from '@/components/guards/ModuleGuard';

const ItemSerialsPage = lazy(() => import('@/ui/item-serials/pages/ItemSerialsPage'));

const route: FuseRouteItemType = {
	path: 'inventory/serials',
	element: (
		<ModuleGuard module={['inventory']}>
			<ItemSerialsPage />
		</ModuleGuard>
	)
};

export default route;

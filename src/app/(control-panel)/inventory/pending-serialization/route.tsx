import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

import ModuleGuard from '@/components/guards/ModuleGuard';

const PendingSerializationPage = lazy(() => import('@/ui/pending-serialization/pages/PendingSerializationPage'));

const route: FuseRouteItemType = {
	path: 'inventory/pending-serialization',
	element: (
		<ModuleGuard module={['sales', 'purchases']}>
			<PendingSerializationPage />
		</ModuleGuard>
	)
};

export default route;

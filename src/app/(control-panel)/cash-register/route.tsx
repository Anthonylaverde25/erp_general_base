import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

import ModuleGuard from '@/components/guards/ModuleGuard';

const CashRegisterView = lazy(() => import('@/ui/cash-register/pages/CashRegister'));
const CashRegisterListView = lazy(() => import('@/ui/cash-register/pages/CashRegistersPage'));

/**
 * The Dashboard page route.
 */
const route: FuseRouteItemType = {
	path: 'cash-register',
	element: <ModuleGuard module="pos" />,
	children: [
		{
			path: '',
			element: <CashRegisterView />
		},
		{
			path: 'registers',
			element: <CashRegisterListView />
		}
	]
};

export default route;

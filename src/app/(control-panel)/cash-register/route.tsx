import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const CashRegisterView = lazy(() => import('@/ui/cash-register/pages/CashRegister'));
const CashRegisterListView = lazy(() => import('@/ui/cash-register/pages/CashRegistersPage'));

/**
 * The Dashboard page route.
 */
const route: FuseRouteItemType = {
	path: 'cash-register',
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

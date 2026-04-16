import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const CashRegisterView = lazy(() => import('@/ui/cash-register/pages/CashRegister'));

/**
 * The Dashboard page route.
 */
const route: FuseRouteItemType = {
    path: 'cash-register',
    element: <CashRegisterView />
};

export default route;

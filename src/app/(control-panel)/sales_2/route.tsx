import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const SalesPageV2 = lazy(() => import('@/ui/documents/pages/SalesPageV2'));

const route: FuseRouteItemType = {
    path: 'sales_2',
    element: <SalesPageV2 />
};

export default route;

import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const SalesPage = lazy(() => import('@/ui/documents/pages/SalesPage'));
const CreateSalesDocumentPage = lazy(() => import('@/ui/documents/pages/CreateSalesDocumentPage'));

const route: FuseRouteItemType = {
	path: 'sales',
	children: [
		{
			path: '',
			element: <SalesPage />
		},
		{
			path: 'create',
			element: <CreateSalesDocumentPage />
		}
	]
};

export default route;

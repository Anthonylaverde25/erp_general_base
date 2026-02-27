import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const SalesPage = lazy(() => import('@/ui/documents/pages/SalesPage'));
const CreateSalesDocumentPage = lazy(() => import('@/ui/documents/pages/CreateSalesDocumentPage'));
const DocumentShowPage = lazy(() => import('@/ui/documents/pages/DocumentShowPage'));

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
		},
		{
			path: ':documentId',
			element: <DocumentShowPage />
		}
	]
};

export default route;

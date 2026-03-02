import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const SalesPage = lazy(() => import('@/ui/documents/pages/SalesPage'));
const CreateSalesDocumentPage = lazy(() => import('@/ui/documents/pages/CreateSalesDocumentPage'));
const DocumentShowPage = lazy(() => import('@/ui/documents/pages/DocumentShowPage'));
const PartnersPage = lazy(() => import('@/ui/partners/pages/PartnersPage'));

const route: FuseRouteItemType = {
	path: 'sales',
	children: [
		{
			path: 'customers',
			element: <PartnersPage defaultTab="client" />
		},
		{
			path: 'view/:documentId',
			element: <DocumentShowPage />
		},
		{
			path: ':code?',
			element: <SalesPage />
		},
		{
			path: 'create/:code?',
			element: <CreateSalesDocumentPage />
		}
	]
};

export default route;

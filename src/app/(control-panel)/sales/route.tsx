import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

import ModuleGuard from '@/components/guards/ModuleGuard';

const SalesPage = lazy(() => import('@/ui/documents/pages/SalesPage'));
const CreateSalesDocumentPage = lazy(() => import('@/ui/documents/pages/CreateSalesDocumentPage'));
const EditSalesDocumentPage = lazy(() => import('@/ui/documents/pages/EditSalesDocumentPage'));
const DocumentShowPage = lazy(() => import('@/ui/documents/pages/DocumentShowPage'));
const PartnersPage = lazy(() => import('@/ui/partners/pages/PartnersPage'));
const GroupedInvoicesPage = lazy(() => import('@/ui/documents/pages/GroupedInvoicesPage'));

const route: FuseRouteItemType = {
	path: 'sales',
	element: <ModuleGuard module="sales" />,
	children: [
		{
			path: 'grouped-invoices',
			element: <GroupedInvoicesPage />
		},
		{
			path: 'customers',
			element: <PartnersPage defaultTab="client" />
		},
		{
			path: 'view/:documentId',
			element: <DocumentShowPage />
		},
		{
			path: 'edit/:code/:documentId',
			element: <EditSalesDocumentPage />
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

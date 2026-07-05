import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

import ModuleGuard from '@/components/guards/ModuleGuard';

const PurchasesPage = lazy(() => import('@/ui/documents/pages/PurchasesPage'));
const CreatePurchaseDocumentPage = lazy(() => import('@/ui/documents/pages/CreatePurchaseDocumentPage'));
const EditPurchaseDocumentPage = lazy(() => import('@/ui/documents/pages/EditPurchaseDocumentPage'));
const DocumentShowPage = lazy(() => import('@/ui/documents/pages/DocumentShowPage'));
const PartnersPage = lazy(() => import('@/ui/partners/pages/PartnersPage'));

const route: FuseRouteItemType = {
	path: 'purchases',
	element: <ModuleGuard module="purchases" />,
	children: [
		{
			path: 'suppliers',
			element: <PartnersPage defaultTab="supplier" />
		},
		{
			path: 'view/:documentId',
			element: <DocumentShowPage />,
			auth: ['purchases.invoice.read']
		},
		{
			path: 'edit/:code/:documentId',
			element: <EditPurchaseDocumentPage />,
			auth: ['purchases.invoice.edit']
		},
		{
			path: ':code?',
			element: <PurchasesPage />,
			auth: ['purchases.invoice.read']
		},
		{
			path: 'create/:code?',
			element: <CreatePurchaseDocumentPage />,
			auth: ['purchases.invoice.create']
		}
	]
};

export default route;

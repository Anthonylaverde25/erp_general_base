import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const PurchasesPage = lazy(() => import('@/ui/documents/pages/PurchasesPage'));
const CreatePurchaseDocumentPage = lazy(() => import('@/ui/documents/pages/CreatePurchaseDocumentPage'));
const PartnersPage = lazy(() => import('@/ui/partners/pages/PartnersPage'));

const route: FuseRouteItemType = {
	path: 'purchases',
	children: [
		{
			path: 'suppliers',
			element: <PartnersPage defaultTab="supplier" />
		},
		{
			path: ':code?',
			element: <PurchasesPage />
		},
		{
			path: 'create/:code?',
			element: <CreatePurchaseDocumentPage />
		}
	]
};

export default route;

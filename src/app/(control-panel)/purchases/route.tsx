import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const PurchasesPage = lazy(() => import('@/ui/documents/pages/PurchasesPage'));
const CreatePurchaseDocumentPage = lazy(() => import('@/ui/documents/pages/CreatePurchaseDocumentPage'));

const route: FuseRouteItemType = {
	path: 'purchases',
	children: [
		{
			path: '',
			element: <PurchasesPage />
		},
		{
			path: 'create',
			element: <CreatePurchaseDocumentPage />
		}
	]
};

export default route;

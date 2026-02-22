import { lazy } from 'react';

const TaxTypesTabView = lazy(() => import('../components/TaxTypesTabView'));

export default function TaxTypesPage() {
	return <TaxTypesTabView />;
}

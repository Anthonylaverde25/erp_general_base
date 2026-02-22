import { lazy } from 'react';

const TaxRatesTabView = lazy(() => import('../components/TaxRatesTabView'));

export default function TaxRatesPage() {
	return <TaxRatesTabView />;
}

import { lazy } from 'react';

const UnitTypesTabView = lazy(() => import('../components/UnitTypesTabView'));

export default function UnitTypesPage() {
	return <UnitTypesTabView />;
}

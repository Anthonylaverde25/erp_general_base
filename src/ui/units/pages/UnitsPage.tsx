import { lazy } from 'react';

const UnitsTabView = lazy(() => import('../components/UnitsTabView'));

export default function UnitsPage() {
	return <UnitsTabView />;
}

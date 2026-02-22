import { lazy } from 'react';

const StoresTabView = lazy(() => import('../components/StoresTabView'));

export default function StoresPage() {
	return <StoresTabView />;
}

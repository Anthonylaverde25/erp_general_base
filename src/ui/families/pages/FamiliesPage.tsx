import { lazy } from 'react';

const FamiliesTabView = lazy(() => import('../components/FamiliesTabView'));

export default function FamiliesPage() {
	return <FamiliesTabView />;
}

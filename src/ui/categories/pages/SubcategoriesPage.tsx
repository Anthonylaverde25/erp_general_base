import { lazy } from 'react';

const SubcategoriesTabView = lazy(() => import('../components/SubcategoriesTabView'));

export default function SubcategoriesPage() {
	return <SubcategoriesTabView />;
}

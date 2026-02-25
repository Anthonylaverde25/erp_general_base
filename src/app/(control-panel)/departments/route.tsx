import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const DepartmentsPage = lazy(() => import('@/ui/departments/pages/DepartmentsPage'));
const DepartmentAnalyticsPage = lazy(() => import('@/ui/departments/pages/DepartmentAnalyticsPage'));
const DepartmentDocumentsPage = lazy(() => import('@/ui/departments/pages/DepartmentDocumentsPage'));

/**
 * The Departments page route.
 */
const route: FuseRouteItemType = {
	path: 'departments',
	children: [
		{
			path: '',
			element: <DepartmentsPage />
		},
		{
			path: 'analytics/:fileId',
			element: <DepartmentAnalyticsPage />
		},
		{
			path: ':code/documents',
			element: <DepartmentDocumentsPage />
		},
		{
			path: ':code',
			element: <DepartmentsPage />
		}
	]
};

export default route;

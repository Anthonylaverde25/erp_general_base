import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const EmployeesPage = lazy(() => import('@/ui/employees/pages/EmployeesPage'));

/**
 * The Employees page route.
 */
const route: FuseRouteItemType = {
	path: 'hr/employees',
	element: <EmployeesPage />
};

export default route;

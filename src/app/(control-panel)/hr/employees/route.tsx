import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

import ModuleGuard from '@/components/guards/ModuleGuard';

const EmployeesPage = lazy(() => import('@/ui/employees/pages/EmployeesPage'));

/**
 * The Employees page route.
 */
const route: FuseRouteItemType = {
	path: 'hr/employees',
	element: (
		<ModuleGuard module="hr">
			<EmployeesPage />
		</ModuleGuard>
	)
};

export default route;

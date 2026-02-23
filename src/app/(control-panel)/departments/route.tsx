import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const DepartmentsPage = lazy(() => import('@/ui/departments/pages/DepartmentsPage'));

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
            path: ':code',
            element: <DepartmentsPage />
        }
    ]
};

export default route;

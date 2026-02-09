import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { Outlet } from 'react-router';

const ContactsPage = lazy(() => import('./ContactsPage'));
const CreateContactPage = lazy(() => import('./CreateContactPage'));

/**
 * The Contacts page route.
 */
const route: FuseRouteItemType = {
	path: 'contacts',
	element: <Outlet />,
	children: [
		{
			path: '',
			element: <ContactsPage />
		},
		{
			path: 'new',
			element: <CreateContactPage />
		}
	]
};

export default route;

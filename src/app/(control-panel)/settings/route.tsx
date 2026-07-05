import { lazy } from 'react';
import { Navigate, Outlet } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const SettingsAppView = lazy(() => import('@/ui/admin-settings/components/views/SettingsAppView'));
const SettingPage = lazy(() => import('@/ui/admin-settings/pages/SettingPage'));
const SecurityTabView = lazy(() => import('@/ui/admin-settings/components/views/SecurityTabView'));
const PlanBillingTabView = lazy(() => import('@/ui/admin-settings/components/views/PlanBillingTabView'));
const NotificationsTabView = lazy(() => import('@/ui/admin-settings/components/views/NotificationsTabView'));
const TeamTabView = lazy(() => import('@/ui/users/pages/TeamTabView'));
const RolesTabView = lazy(() => import('@/ui/roles/pages/RoleTabView'));
const BankAccountTabView = lazy(() => import('@/ui/bank_accounts/pages/BankAccountTabView'));
const PaymentMethodsPage = lazy(() => import('@/ui/payment_methods/pages/PaymentMethodsPage'));
const StoresPage = lazy(() => import('@/ui/stores/pages/StoresPage'));
const NumberSeriesPage = lazy(() => import('@/ui/number_series/pages/NumberSeriesPage'));
const TaxTypesPage = lazy(() => import('@/ui/tax_types/pages/TaxTypesPage'));
const TaxRatesPage = lazy(() => import('@/ui/tax_rates/pages/TaxRatesPage'));
const FamiliesPage = lazy(() => import('@/ui/families/pages/FamiliesPage'));
const PartnersPage = lazy(() => import('@/ui/partners/pages/PartnersPage'));
const CategoriesPage = lazy(() => import('@/ui/categories/pages/CategoriesPage'));
const SubcategoriesPage = lazy(() => import('@/ui/categories/pages/SubcategoriesPage'));
const UnitTypesPage = lazy(() => import('@/ui/unit_types/pages/UnitTypesPage'));
const UnitsPage = lazy(() => import('@/ui/units/pages/UnitsPage'));
const FileTypesPage = lazy(() => import('@/ui/file_types/pages/FileTypesPage'));

/**
 * The Settings App Route.
 */
const Route: FuseRouteItemType = {
	path: 'apps/settings',
	element: (
		<SettingsAppView>
			<Outlet />
		</SettingsAppView>
	),
	auth: ['settings.general.manage', 'settings.team.manage', 'settings.roles.manage'],
	children: [
		{
			path: 'account',
			element: <SettingPage />,
			auth: ['settings.general.manage']
		},
		{
			path: 'security',
			element: <SecurityTabView />,
			auth: ['settings.general.manage']
		},
		{
			path: 'plan-billing',
			element: <PlanBillingTabView />,
			auth: ['settings.general.manage']
		},
		{
			path: 'notifications',
			element: <NotificationsTabView />,
			auth: ['settings.general.manage']
		},
		{
			path: 'team',
			element: <TeamTabView />,
			auth: ['settings.team.manage']
		},
		{
			path: 'roles',
			element: <RolesTabView />,
			auth: ['settings.roles.manage']
		},
		{
			path: 'bank-accounts',
			element: <BankAccountTabView />,
			auth: ['settings.general.manage']
		},
		{
			path: 'payment-methods',
			element: <PaymentMethodsPage />,
			auth: ['settings.general.manage']
		},
		{
			path: 'stores',
			element: <StoresPage />,
			auth: ['settings.general.manage']
		},
		{
			path: 'number-serie',
			element: <NumberSeriesPage />,
			auth: ['settings.general.manage']
		},
		{
			path: 'tax-types',
			element: <TaxTypesPage />,
			auth: ['settings.general.manage']
		},
		{
			path: 'tax-rate',
			element: <TaxRatesPage />,
			auth: ['settings.general.manage']
		},
		{
			path: 'families',
			element: <FamiliesPage />,
			auth: ['settings.general.manage']
		},
		{
			path: 'partners',
			element: <PartnersPage />,
			auth: ['settings.general.manage']
		},
		{
			path: 'categories',
			element: <CategoriesPage />,
			auth: ['settings.general.manage']
		},
		{
			path: 'subcategories',
			element: <SubcategoriesPage />,
			auth: ['settings.general.manage']
		},
		{
			path: 'unit-types',
			element: <UnitTypesPage />,
			auth: ['settings.general.manage']
		},
		{
			path: 'units',
			element: <UnitsPage />,
			auth: ['settings.general.manage']
		},
		{
			path: 'file-types',
			element: <FileTypesPage />,
			auth: ['settings.general.manage']
		},
		{
			path: '',
			element: <Navigate to="account" />
		}
	]
};

export default Route;

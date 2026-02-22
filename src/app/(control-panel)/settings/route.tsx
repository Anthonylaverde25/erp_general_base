import { lazy } from 'react';
import { Navigate, Outlet } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const SettingsAppView = lazy(() => import('./components/views/SettingsAppView'));
const SettingPage = lazy(() => import('@/ui/admin-settings/pages/SettingPage'));
const SecurityTabView = lazy(() => import('./components/views/SecurityTabView'));
const PlanBillingTabView = lazy(() => import('./components/views/PlanBillingTabView'));
const NotificationsTabView = lazy(() => import('./components/views/NotificationsTabView'));
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
	children: [
		{
			path: 'account',
			element: <SettingPage />
		},
		{
			path: 'security',
			element: <SecurityTabView />
		},
		{
			path: 'plan-billing',
			element: <PlanBillingTabView />
		},
		{
			path: 'security',
			element: <SecurityTabView />
		},
		{
			path: 'notifications',
			element: <NotificationsTabView />
		},
		{
			path: 'team',
			element: <TeamTabView />
		},
		{
			path: 'roles',
			element: <RolesTabView />
		},
		{
			path: 'bank-accounts',
			element: <BankAccountTabView />
		},
		{
			path: 'payment-methods',
			element: <PaymentMethodsPage />
		},
		{
			path: 'stores',
			element: <StoresPage />
		},
		{
			path: 'number-serie',
			element: <NumberSeriesPage />
		},
		{
			path: 'tax-types',
			element: <TaxTypesPage />
		},
		{
			path: 'tax-rate',
			element: <TaxRatesPage />
		},
		{
			path: 'families',
			element: <FamiliesPage />
		},
		{
			path: 'partners',
			element: <PartnersPage />
		},
		{
			path: 'categories',
			element: <CategoriesPage />
		},
		{
			path: 'subcategories',
			element: <SubcategoriesPage />
		},
		{
			path: 'unit-types',
			element: <UnitTypesPage />
		},
		{
			path: 'units',
			element: <UnitsPage />
		},
		{
			path: '',
			element: <Navigate to="account" />
		}
	]
};

export default Route;

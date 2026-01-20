import i18n from '@i18n';
import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import en from './navigation-i18n/en';
import es from './navigation-i18n/es';

i18n.addResourceBundle('en', 'navigation', en);
i18n.addResourceBundle('es', 'navigation', es);

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig: FuseNavItemType[] = [
	{
		id: 'dashboard',
		title: 'Dashboard',
		translate: 'DASHBOARD',
		type: 'item',
		icon: 'lucide:layout-dashboard',
		url: '/'
	},
	{
		id: 'operations',
		title: 'Operations',
		translate: 'OPERATIONS',
		subtitle: 'Sales, Purchases & Inventory',
		type: 'group',
		icon: 'lucide:briefcase',
		children: [
			{
				id: 'sales',
				title: 'Sales',
				translate: 'SALES',
				type: 'collapse',
				icon: 'lucide:shopping-cart',
				children: [
					{
						id: 'sales.quotes',
						title: 'Quotes',
						translate: 'QUOTES',
						type: 'item',
						url: '/sales/quotes',
						icon: 'lucide:file-text'
					},
					{
						id: 'sales.orders',
						title: 'Orders',
						translate: 'ORDERS',
						type: 'item',
						url: '/sales/orders',
						icon: 'lucide:shopping-bag'
					},
					{
						id: 'sales.invoices',
						title: 'Invoices',
						translate: 'INVOICES',
						type: 'item',
						url: '/sales/invoices',
						icon: 'lucide:receipt'
					},
					{
						id: 'sales.customers',
						title: 'Customers',
						translate: 'CUSTOMERS',
						type: 'item',
						url: '/sales/customers',
						icon: 'lucide:users'
					}
				]
			},
			{
				id: 'purchases',
				title: 'Purchases',
				translate: 'PURCHASES',
				type: 'collapse',
				icon: 'lucide:package',
				children: [
					{
						id: 'purchases.requests',
						title: 'Purchase Requests',
						translate: 'PURCHASE_REQUESTS',
						type: 'item',
						url: '/purchases/requests',
						icon: 'lucide:file-plus'
					},
					{
						id: 'purchases.orders',
						title: 'Purchase Orders',
						translate: 'PURCHASE_ORDERS',
						type: 'item',
						url: '/purchases/orders',
						icon: 'lucide:clipboard-list'
					},
					{
						id: 'purchases.bills',
						title: 'Bills',
						translate: 'BILLS',
						type: 'item',
						url: '/purchases/bills',
						icon: 'lucide:file-invoice'
					},
					{
						id: 'purchases.suppliers',
						title: 'Suppliers',
						translate: 'SUPPLIERS',
						type: 'item',
						url: '/purchases/suppliers',
						icon: 'lucide:truck'
					}
				]
			},
			{
				id: 'inventory',
				title: 'Inventory',
				translate: 'INVENTORY',
				type: 'collapse',
				icon: 'lucide:box',
				children: [
					{
						id: 'inventory.products',
						title: 'Products',
						translate: 'PRODUCTS',
						type: 'item',
						url: '/inventory/products',
						icon: 'lucide:package-2'
					},
					{
						id: 'inventory.categories',
						title: 'Categories',
						translate: 'CATEGORIES',
						type: 'item',
						url: '/inventory/categories',
						icon: 'lucide:folder'
					},
					{
						id: 'inventory.warehouses',
						title: 'Warehouses',
						translate: 'WAREHOUSES',
						type: 'item',
						url: '/inventory/warehouses',
						icon: 'lucide:warehouse'
					},
					{
						id: 'inventory.stock-movements',
						title: 'Stock Movements',
						translate: 'STOCK_MOVEMENTS',
						type: 'item',
						url: '/inventory/stock-movements',
						icon: 'lucide:arrow-right-left'
					}
				]
			}
		]
	},
	{
		id: 'finance',
		title: 'Finance',
		translate: 'FINANCE',
		subtitle: 'Accounting & Payments',
		type: 'group',
		icon: 'lucide:wallet',
		children: [
			{
				id: 'accounting',
				title: 'Accounting',
				translate: 'ACCOUNTING',
				type: 'collapse',
				icon: 'lucide:calculator',
				children: [
					{
						id: 'accounting.accounts',
						title: 'Chart of Accounts',
						translate: 'CHART_OF_ACCOUNTS',
						type: 'item',
						url: '/accounting/accounts',
						icon: 'lucide:list'
					},
					{
						id: 'accounting.journal-entries',
						title: 'Journal Entries',
						translate: 'JOURNAL_ENTRIES',
						type: 'item',
						url: '/accounting/journal-entries',
						icon: 'lucide:book-open'
					},
					{
						id: 'accounting.payments',
						title: 'Payments',
						translate: 'PAYMENTS',
						type: 'item',
						url: '/accounting/payments',
						icon: 'lucide:credit-card'
					},
					{
						id: 'accounting.bank-accounts',
						title: 'Bank Accounts',
						translate: 'BANK_ACCOUNTS',
						type: 'item',
						url: '/accounting/bank-accounts',
						icon: 'lucide:landmark'
					}
				]
			}
		]
	},
	{
		id: 'human-resources',
		title: 'Human Resources',
		translate: 'HUMAN_RESOURCES_GROUP',
		subtitle: 'Employee Management',
		type: 'group',
		icon: 'lucide:users-2',
		children: [
			{
				id: 'hr',
				title: 'HR Management',
				translate: 'HR_MANAGEMENT',
				type: 'collapse',
				icon: 'lucide:users-2',
				children: [
					{
						id: 'hr.employees',
						title: 'Employees',
						translate: 'EMPLOYEES',
						type: 'item',
						url: '/hr/employees',
						icon: 'lucide:user'
					},
					{
						id: 'hr.departments',
						title: 'Departments',
						translate: 'DEPARTMENTS',
						type: 'item',
						url: '/hr/departments',
						icon: 'lucide:building-2'
					},
					{
						id: 'hr.attendance',
						title: 'Attendance',
						translate: 'ATTENDANCE',
						type: 'item',
						url: '/hr/attendance',
						icon: 'lucide:calendar-check'
					},
					{
						id: 'hr.payroll',
						title: 'Payroll',
						translate: 'PAYROLL',
						type: 'item',
						url: '/hr/payroll',
						icon: 'lucide:wallet'
					}
				]
			}
		]
	},
	{
		id: 'analytics',
		title: 'Analytics',
		translate: 'ANALYTICS',
		subtitle: 'Reports & Insights',
		type: 'group',
		icon: 'lucide:bar-chart-3',
		children: [
			{
				id: 'reports',
				title: 'Reports',
				translate: 'REPORTS',
				type: 'collapse',
				icon: 'lucide:bar-chart',
				children: [
					{
						id: 'reports.sales',
						title: 'Sales Reports',
						translate: 'SALES_REPORTS',
						type: 'item',
						url: '/reports/sales',
						icon: 'lucide:trending-up'
					},
					{
						id: 'reports.purchases',
						title: 'Purchase Reports',
						translate: 'PURCHASE_REPORTS',
						type: 'item',
						url: '/reports/purchases',
						icon: 'lucide:trending-down'
					},
					{
						id: 'reports.inventory',
						title: 'Inventory Reports',
						translate: 'INVENTORY_REPORTS',
						type: 'item',
						url: '/reports/inventory',
						icon: 'lucide:pie-chart'
					},
					{
						id: 'reports.financial',
						title: 'Financial Reports',
						translate: 'FINANCIAL_REPORTS',
						type: 'item',
						url: '/reports/financial',
						icon: 'lucide:line-chart'
					}
				]
			}
		]
	},
	{
		id: 'administration',
		title: 'Administration',
		translate: 'ADMINISTRATION',
		subtitle: 'System Configuration',
		type: 'group',
		icon: 'lucide:cog',
		children: [
			{
				id: 'settings',
				title: 'Settings',
				translate: 'SETTINGS',
				type: 'collapse',
				icon: 'lucide:settings',
				children: [
					{
						id: 'settings.company',
						title: 'Company',
						translate: 'COMPANY',
						type: 'item',
						url: '/apps/settings',
						icon: 'lucide:building'
					},
					{
						id: 'settings.users',
						title: 'Users',
						translate: 'USERS',
						type: 'item',
						url: '/settings/users',
						icon: 'lucide:user-cog'
					},
					{
						id: 'settings.roles',
						title: 'Roles & Permissions',
						translate: 'ROLES_PERMISSIONS',
						type: 'item',
						url: '/settings/roles',
						icon: 'lucide:shield'
					},
					{
						id: 'settings.taxes',
						title: 'Taxes',
						translate: 'TAXES',
						type: 'item',
						url: '/settings/taxes',
						icon: 'lucide:percent'
					}
				]
			}
		]
	}
];

export default navigationConfig;

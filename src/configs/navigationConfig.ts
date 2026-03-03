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
		id: 'partners',
		title: 'partners',
		translate: 'PARTNERS',
		type: 'item',
		icon: 'lucide:users',
		url: '/partners'
	},
	{
		id: 'items',
		title: 'Items',
		translate: 'ITEMS',
		type: 'item',
		icon: 'heroicons-outline:cube',
		url: '/items'
	},
	{
		id: 'departments',
		title: 'Departments',
		translate: 'DEPARTMENTS',
		type: 'item',
		icon: 'lucide:building-2',
		url: '/departments'
	},
	{
		id: 'operations-items',
		title: 'Artículos',
		translate: 'ITEMS_GROUP',
		subtitle: 'Documentos de compra/venta de artículos',
		type: 'group',
		icon: 'lucide:package',
		children: [
			{
				id: 'sales-items',
				title: 'Ingresos',
				translate: 'SALES',
				type: 'collapse',
				icon: 'lucide:trending-up',
				children: [
					{
						id: 'sales.invoices',
						title: 'Facturas de Venta',
						translate: 'LIST_INVOICES',
						type: 'item',
						icon: 'lucide:receipt',
						url: '/sales/INV',
						quickCreateUrl: '/sales/create/INV'


					},
					{
						id: 'sales.quotes',
						title: 'Presupuestos',
						translate: 'LIST_QUOTES',
						type: 'item',
						icon: 'lucide:clipboard-list',
						url: '/sales/QUO',
						quickCreateUrl: '/sales/create/QUO'
					},
					{
						id: 'sales.delivery',
						title: 'Albaranes de Venta',
						translate: 'LIST_DELIVERY_NOTES',
						type: 'item',
						icon: 'lucide:truck',
						url: '/sales/DLV',
						quickCreateUrl: '/sales/create/DLV'
					},
					{
						id: 'sales.remittance',
						title: 'Remitos',
						translate: 'LIST_REMITTANCES',
						type: 'item',
						icon: 'lucide:file-text',
						url: '/sales/REM',
						quickCreateUrl: '/sales/create/REM'
					},
					{
						id: 'sales.ticket',
						title: 'Tickets',
						translate: 'LIST_TICKETS',
						type: 'item',
						icon: 'lucide:ticket',
						url: '/sales/TKT',
						quickCreateUrl: '/sales/create/TKT'
					},
					{
						id: 'sales.credit_note',
						title: 'Facturas Rectificativas',
						translate: 'LIST_CREDIT_NOTES',
						type: 'item',
						icon: 'lucide:file-minus',
						url: '/sales/CRN',
						quickCreateUrl: '/sales/create/CRN'
					},
					{
						id: 'sales.customers',
						title: 'Clientes',
						translate: 'CUSTOMERS',
						type: 'item',
						icon: 'lucide:users',
						url: '/sales/customers'
					}
				]
			},
			{
				id: 'purchases-items',
				title: 'Gastos',
				translate: 'PURCHASES',
				type: 'collapse',
				icon: 'lucide:trending-down',
				children: [
					{
						id: 'purchases.invoices',
						title: 'Facturas de Compra',
						translate: 'LIST_PURCHASE_INVOICES',
						type: 'item',
						icon: 'lucide:receipt',
						url: '/purchases/PINV',
						quickCreateUrl: '/purchases/create/PINV'
					},
					{
						id: 'purchases.delivery',
						title: 'Albaranes de Compra',
						translate: 'LIST_PURCHASE_DELIVERY_NOTES',
						type: 'item',
						icon: 'lucide:truck',
						url: '/purchases/PDLV',
						quickCreateUrl: '/purchases/create/PDLV'
					},
					{
						id: 'purchases.order',
						title: 'Pedidos de Compra',
						translate: 'LIST_PURCHASE_ORDERS',
						type: 'item',
						icon: 'lucide:shopping-cart',
						url: '/purchases/PORD',
						quickCreateUrl: '/purchases/create/PORD'
					},
					{
						id: 'purchases.suppliers',
						title: 'Proveedores',
						translate: 'SUPPLIERS',
						type: 'item',
						icon: 'lucide:truck',
						url: '/purchases/suppliers'
					}
				]
			}
		]
	},
	{
		id: 'operations-services',
		title: 'Servicios',
		translate: 'SERVICES_GROUP',
		subtitle: 'Documentos de compra/venta de servicios',
		type: 'group',
		icon: 'lucide:briefcase',
		children: [
			{
				id: 'sales-services',
				title: 'Ingresos',
				translate: 'SALES',
				type: 'collapse',
				icon: 'lucide:trending-up',
				children: [
					{
						id: 'sales.inv.services',
						title: 'Facturas de Venta',
						translate: 'LIST_INVOICES',
						type: 'item',
						icon: 'lucide:receipt',
						url: '/sales/INV?item_type=service',
						quickCreateUrl: '/sales/create/INV?item_type=service'
					},
					{
						id: 'sales.quo.services',
						title: 'Presupuestos',
						translate: 'LIST_QUOTES',
						type: 'item',
						icon: 'lucide:clipboard-list',
						url: '/sales/QUO?item_type=service',
						quickCreateUrl: '/sales/create/QUO?item_type=service'
					}
				]
			},
			{
				id: 'purchases-services',
				title: 'Gastos',
				translate: 'PURCHASES',
				type: 'collapse',
				icon: 'lucide:trending-down',
				children: [
					{
						id: 'purchases.inv.services',
						title: 'Facturas de Compra',
						translate: 'LIST_PURCHASE_INVOICES',
						type: 'item',
						icon: 'lucide:receipt',
						url: '/purchases/PINV?item_type=service',
						quickCreateUrl: '/purchases/create/PINV?item_type=service'
					},
					{
						id: 'purchases.pord.services',
						title: 'Pedidos de Compra',
						translate: 'LIST_PURCHASE_ORDERS',
						type: 'item',
						icon: 'lucide:shopping-cart',
						url: '/purchases/PORD?item_type=service',
						quickCreateUrl: '/purchases/create/PORD?item_type=service'
					}
				]
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

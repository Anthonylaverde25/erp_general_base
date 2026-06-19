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
		id: 'test-stock',
		title: 'Test Stock',
		translate: 'STOCK_TEST',
		type: 'item',
		icon: 'lucide:layout-dashboard',
		url: '/test-stock'
	},
	{
		id: 'delivery',
		title: 'Entregas',
		translate: 'DELIVERY',
		type: 'collapse',
		icon: 'lucide:truck',
		children: [
			{
				id: 'delivery.products',
				title: 'Reparto de Artículos',
				translate: 'DELIVERY_PRODUCTS',
				type: 'item',
				icon: 'lucide:package',
				url: '/delivery/DLV?item_type=product'
			},
			{
				id: 'delivery.services',
				title: 'Órdenes de Servicios',
				translate: 'DELIVERY_SERVICES',
				type: 'item',
				icon: 'lucide:briefcase',
				url: '/delivery/DLV?item_type=service'
			},
			{
				id: 'delivery.route-list',
				title: 'Rutas Activas',
				translate: 'DELIVERY_ROUTE_ACTIVE',
				type: 'item',
				icon: 'lucide:route',
				url: '/delivery/route-list'
			},
			{
				id: 'delivery.route-history',
				title: 'Historial de Rutas',
				translate: 'DELIVERY_ROUTE_HISTORY',
				type: 'item',
				icon: 'lucide:history',
				url: '/delivery/route-history'
			}
		]
	},
	{
		id: 'HR',
		title: 'RRHH',
		subtitle: 'Recursos Humanos',
		translate: 'HR',
		type: 'collapse',
		icon: 'lucide:user',
		children: [
			{
				id: 'employees',
				title: 'Empleados',
				subtitle: 'Gestion de Empleados',
				translate: 'EMPLOYEES',
				type: 'item',
				icon: 'lucide:users',
				url: '/hr/employees'
			},
			{
				id: 'attendances',
				title: 'Asistencias',
				translate: 'ATTENDANCES',
				type: 'item',
				icon: 'lucide:clock',
				url: '/hr/attendances'
			},
			{
				id: 'vacations',
				title: 'Vacaciones',
				translate: 'VACATIONS',
				type: 'item',
				icon: 'lucide:sun',
				url: '/hr/vacations'
			}
		]
	},
	{
		id: 'catalogs',
		title: 'Catálogos',
		translate: 'CATALOGS',
		type: 'collapse',
		icon: 'lucide:folder-open',
		children: [
			{
				id: 'partners',
				title: 'Partners',
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
			}
		]
	},
	{
		id: 'caja.caja',
		title: 'Caja',
		subtitle: 'Apertura, cierre y gestión de cajas',
		translate: 'CAJA',
		type: 'collapse',
		icon: 'lucide:credit-card',
		children: [
			{
				id: 'caja.active',
				title: 'Caja Activa',
				translate: 'CASH_REGISTER_ACTIVE',
				type: 'item',
				url: '/cash-register',
				icon: 'lucide:play-circle'
			},
			{
				id: 'caja.registers',
				title: 'Cajas Creadas',
				translate: 'CASH_REGISTERS_CREATED',
				type: 'item',
				url: '/cash-register/registers',
				icon: 'lucide:list'
			}
		]
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
						url: '/sales/INV?item_type=product',
						quickCreateUrl: '/sales/create/INV?item_type=product'
					},
					{
						id: 'sales.quotes',
						title: 'Presupuestos',
						translate: 'LIST_QUOTES',
						type: 'item',
						icon: 'lucide:clipboard-list',
						url: '/sales/QUO?item_type=product',
						quickCreateUrl: '/sales/create/QUO?item_type=product'
					},
					{
						id: 'sales.delivery',
						title: 'Albaranes de Venta',
						translate: 'LIST_DELIVERY_NOTES',
						type: 'item',
						icon: 'lucide:truck',
						url: '/sales/DLV?item_type=product',
						quickCreateUrl: '/sales/create/DLV?item_type=product'

					},
					{
						id: 'sales.ticket',
						title: 'Tickets',
						translate: 'LIST_TICKETS',
						type: 'item',
						icon: 'lucide:ticket',
						url: '/sales/TKT?item_type=product',
						quickCreateUrl: '/sales/create/TKT?item_type=product'
					},
					{
						id: 'sales.credit_note',
						title: 'Facturas Rectificativas',
						translate: 'LIST_CREDIT_NOTES',
						type: 'item',
						icon: 'lucide:file-minus',
						url: '/sales/CRN?item_type=product',
						quickCreateUrl: '/sales/create/CRN?item_type=product'
					},
					{
						id: 'sales.customers',
						title: 'Clientes',
						translate: 'CUSTOMERS',
						type: 'item',
						icon: 'lucide:users',
						url: '/sales/customers'
					},
					{
						id: 'sales.grouped_invoices',
						title: 'Facturación Agrupada',
						translate: 'GROUPED_INVOICES',
						type: 'item',
						icon: 'lucide:layers',
						url: '/sales/grouped-invoices'
					},
					{
						id: 'sales.prospects',
						title: 'Prospectos',
						translate: 'PROSPECTS',
						type: 'item',
						icon: 'lucide:user-plus',
						url: '/partners?type=prospect'
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
						url: '/purchases/PINV?item_type=product',
						quickCreateUrl: '/purchases/create/PINV?item_type=product'
					},
					{
						id: 'purchases.delivery',
						title: 'Albaranes de Compra',
						translate: 'LIST_PURCHASE_DELIVERY_NOTES',
						type: 'item',
						icon: 'lucide:truck',
						url: '/purchases/PDLV?item_type=product',
						quickCreateUrl: '/purchases/create/PDLV?item_type=product'
					},
					{
						id: 'purchases.order',
						title: 'Pedidos de Compra',
						translate: 'LIST_PURCHASE_ORDERS',
						type: 'item',
						icon: 'lucide:shopping-cart',
						url: '/purchases/PORD?item_type=product',
						quickCreateUrl: '/purchases/create/PORD?item_type=product'
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
					},
					{
						id: 'sales.dlv.services',
						title: 'Albaranes de Venta',
						translate: 'LIST_DELIVERY_NOTES',
						type: 'item',
						icon: 'lucide:truck',
						url: '/sales/DLV?item_type=service',
						quickCreateUrl: '/sales/create/DLV?item_type=service'
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
						id: 'purchases.pdlv.services',
						title: 'Albaranes de Compra',
						translate: 'LIST_PURCHASE_DELIVERY_NOTES',
						type: 'item',
						icon: 'lucide:truck',
						url: '/purchases/PDLV?item_type=service',
						quickCreateUrl: '/purchases/create/PDLV?item_type=service'
					}
				]
			}
		]
	},
  {
    id: 'lists',
    title: 'Listas',
    translate: 'LISTS',
    type: 'collapse',
    icon: 'lucide:list',
    children: [
      {
        id: 'lists.pending_collections',
        title: 'Pendiente de cobro',
        translate: 'PENDING_COLLECTIONS',
        type: 'item',
        url: '/lists/pending/INV',
        icon: 'lucide:check-circle'
      },
      {
        id: 'lists.pending_payments',
        title: 'Pendiente de pago',
        translate: 'PENDING_PAYMENTS',
        type: 'item',
        url: '/lists/pending/PINV',
        icon: 'lucide:check-circle'
      },
      {
        id: 'lists.accounting_sales',
        title: 'Listado contable (Ventas)',
        translate: 'ACCOUNT_LIST_SALES',
        type: 'item',
        url: '/lists/pending/accounting/INV',
        icon: 'lucide:book-open'
      },
      {
        id: 'lists.accounting_purchases',
        title: 'Listado contable (Compras)',
        translate: 'ACCOUNT_LIST_PURCHASES',
        type: 'item',
        url: '/lists/pending/accounting/PINV',
        icon: 'lucide:book-open'
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
			},
			{
				id: 'inventory.batches',
				title: 'Lotes',
				translate: 'BATCHES',
				type: 'item',
				url: '/inventory/batches',
				icon: 'lucide:layers'
			}
		]
	},

  
];

export default navigationConfig;

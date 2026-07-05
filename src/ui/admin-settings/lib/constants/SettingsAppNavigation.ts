import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';

const SettingsAppNavigation: FuseNavItemType = {
	id: 'apps.settings',
	title: 'Ajustes',
	type: 'collapse',
	icon: 'lucide:settings',
	url: '/apps/settings',
	auth: ['settings.general.manage', 'settings.team.manage', 'settings.roles.manage'],
	children: [
		{
			id: 'apps.settings.account',
			icon: 'lucide:circle-user',
			title: 'Cuenta',
			type: 'item',
			url: '/apps/settings/account',
			subtitle: 'Administra tu perfil público e información privada',
			auth: ['settings.general.manage']
		},
		{
			id: 'apps.settings.team',
			icon: 'lucide:users',
			title: 'Equipo',
			type: 'item',
			url: '/apps/settings/team',
			subtitle: 'Administra tu equipo y permisos',
			auth: ['settings.team.manage']
		},
		{
			id: 'apps.settings.roles',
			icon: 'lucide:shield',
			title: 'Roles',
			type: 'item',
			url: '/apps/settings/roles',
			subtitle: 'Gestiona roles y permisos del sistema',
			auth: ['settings.roles.manage']
		},
		{
			id: 'apps.settings.bankAccounts',
			icon: 'lucide:building-2',
			title: 'Cuentas Bancarias',
			type: 'item',
			url: '/apps/settings/bank-accounts',
			subtitle: 'Administra tus cuentas bancarias',
			auth: ['settings.general.manage']
		},
		{
			id: 'apps.settings.paymentMethods',
			icon: 'lucide:credit-card',
			title: 'Métodos de Pago',
			type: 'item',
			url: '/apps/settings/payment-methods',
			subtitle: 'Gestiona tus métodos de pago disponibles',
			auth: ['settings.general.manage']
		},
		{
			id: 'apps.settings.stores',
			icon: 'lucide:building-2',
			title: 'Tiendas',
			type: 'item',
			url: '/apps/settings/stores',
			subtitle: 'Administra tus tiendas y sucursales',
			auth: ['settings.general.manage']
		},
		{
			id: 'apps.settings.number_serie',
			icon: 'lucide:building-2',
			title: 'Series Numéricas',
			type: 'item',
			url: '/apps/settings/number-serie',
			subtitle: 'Gestiona las series de numeración',
			auth: ['settings.general.manage']
		},
		{
			id: 'apps.settings.tax_types',
			icon: 'lucide:building-2',
			title: 'Tipos de Impuestos',
			type: 'item',
			url: '/apps/settings/tax-types',
			subtitle: 'Administra tipos de impuestos y operaciones',
			auth: ['settings.general.manage']
		},
		{
			id: 'apps.settings.taxRate',
			icon: 'lucide:building-2',
			title: 'Tasas de Impuestos',
			type: 'item',
			url: '/apps/settings/tax-rate',
			subtitle: 'Gestiona los porcentajes de impuestos aplicables',
			auth: ['settings.general.manage']
		},
		{
			id: 'apps.settings.families',
			icon: 'lucide:building-2',
			title: 'Familias',
			type: 'item',
			url: '/apps/settings/families',
			subtitle: 'Organiza tus productos en familias',
			auth: ['settings.general.manage']
		},
		{
			id: 'apps.settings.categories',
			icon: 'lucide:layers',
			title: 'Categorías',
			type: 'item',
			url: '/apps/settings/categories',
			subtitle: 'Gestiona las categorías de tus productos',
			auth: ['settings.general.manage']
		},
		{
			id: 'apps.settings.subcategories',
			icon: 'lucide:layers-2',
			title: 'Subcategorías',
			type: 'item',
			url: '/apps/settings/subcategories',
			subtitle: 'Gestiona las subcategorías de tus productos',
			auth: ['settings.general.manage']
		},
		{
			id: 'apps.settings.unitTypes',
			icon: 'lucide:ruler',
			title: 'Tipos de Unidad',
			type: 'item',
			url: '/apps/settings/unit-types',
			subtitle: 'Gestiona los tipos de unidades de medida',
			auth: ['settings.general.manage']
		},
		{
			id: 'apps.settings.units',
			icon: 'lucide:scale',
			title: 'Unidades',
			type: 'item',
			url: '/apps/settings/units',
			subtitle: 'Gestiona las unidades de medida',
			auth: ['settings.general.manage']
		},
		{
			id: 'apps.settings.fileTypes',
			icon: 'lucide:file-type',
			title: 'Tipos de Archivos',
			type: 'item',
			url: '/apps/settings/file-types',
			subtitle: 'Administra los tipos de documentos adjuntos',
			auth: ['settings.general.manage']
		}
	]
};

export default SettingsAppNavigation;

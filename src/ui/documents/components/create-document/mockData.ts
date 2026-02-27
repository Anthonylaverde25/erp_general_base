import type {
	DocumentCreateCopy,
	DocumentFooterTotals,
	DocumentGridThemeOption,
	DocumentLineItem,
	DocumentOperation
} from './types';

export const LINE_ITEMS: DocumentLineItem[] = [
	{
		id: '01',
		code: 'SRV-PRO-ANNUAL',
		description: 'Suscripción Enterprise Pro - Licencia 2026',
		quantity: '1,00',
		unitPrice: '1.000,00',
		discount: '0,00',
		taxType: 'IVA 21%',
		subtotal: '1.210,00'
	},
	{
		id: '02',
		code: 'CONS-H-SETUP',
		description: 'Horas consultoría implementación flujo trabajo',
		quantity: '2,00',
		unitPrice: '15,00',
		discount: '0,00',
		taxType: 'IVA 21%',
		subtotal: '36,30'
	}
];

export const EMPTY_ROWS_COUNT = 13;

export const TAX_OPTIONS = ['IVA 21%', 'IVA 10%', 'IVA 4%', 'EXENTO'];

export const PARTY_OPTIONS = [
	'00452 - SOFT SOLUTIONS S.A.',
	'00981 - GLOBAL LOGISTICS LTD',
	'00122 - SERVICIOS INTEGRALES SL',
	'01055 - MARKETING DIGITAL PLUS'
];

export const CURRENCY_OPTIONS = ['EUR (€) - Euro', 'USD ($) - Dólar', 'GBP (£) - Libra'];

export const GRID_THEME_OPTIONS: DocumentGridThemeOption[] = [
	{ value: 'material', label: 'Material' },
	{ value: 'quartz', label: 'Quartz' },
	{ value: 'alpine', label: 'Alpine' },
	{ value: 'balham', label: 'Balham' }
];

export const COPY_BY_OPERATION: Record<DocumentOperation, DocumentCreateCopy> = {
	sale: {
		title: 'Facturación Avanzada',
		partyLabel: 'CLIENTE',
		primaryAction: 'Emitir Factura',
		documentNumber: 'FAC-2026-0001',
		topTotal: '1.246,30 €'
	},
	purchase: {
		title: 'Compras Avanzadas',
		partyLabel: 'PROVEEDOR',
		primaryAction: 'Registrar Compra',
		documentNumber: 'COM-2026-0001',
		topTotal: '1.246,30 €'
	}
};

export const FOOTER_TOTALS: DocumentFooterTotals = {
	taxBase: '1.030,00 €',
	taxAmount: '216,30 €',
	withholding: '-154,50 €',
	netPayable: '1.091,80 €'
};

export function buildDocumentRows(baseRows: DocumentLineItem[], emptyRowsCount = EMPTY_ROWS_COUNT): DocumentLineItem[] {
	const emptyRows: DocumentLineItem[] = Array.from({ length: emptyRowsCount }, (_, index) => ({
		id: String(index + baseRows.length + 1).padStart(2, '0'),
		code: '',
		description: '',
		quantity: '',
		unitPrice: '',
		discount: '',
		taxType: TAX_OPTIONS[0],
		subtotal: '0,00'
	}));

	return [...baseRows, ...emptyRows];
}

export type DocumentOperation = 'sale' | 'purchase';
export type DocumentGridTheme = 'material' | 'quartz' | 'alpine' | 'balham';

export interface DocumentCreateCopy {
	title: string;
	partyLabel: string;
	primaryAction: string;
	documentNumber: string;
	topTotal: string;
}

export interface DocumentLineTaxItem {
	id: number;
	name: string;
	rate: number;
	tax_type_id: number;
	operation: 'add' | 'subtract';
}

export interface DocumentLineItem {
	id: string;
	item_id?: number;
	code: string;
	description: string;
	quantity: string;
	unitPrice: string;
	discount: string;
	taxes: DocumentLineTaxItem[];
	subtotal: string;
}

export interface DocumentFooterTotals {
	taxBase: string;
	taxAmount: string;
	withholding: string;
	netPayable: string;
}

export interface DocumentGridThemeOption {
	value: DocumentGridTheme;
	label: string;
}

export interface ItemSearchResult {
	id: number;
	sku: string;
	name: string;
	type: string;
	sale_price: number;
	purchase_price?: number;
	description: string;
	tax_rates: DocumentLineTaxItem[];
}

export const CURRENCY_OPTIONS = ['EUR (€) - Euro', 'USD ($) - Dólar', 'GBP (£) - Libra'];

export const COPY_BY_OPERATION: Record<DocumentOperation, DocumentCreateCopy> = {
	sale: {
		title: 'Facturación Avanzada',
		partyLabel: 'CLIENTE',
		primaryAction: 'Emitir Factura',
		documentNumber: 'FAC-2026-0001',
		topTotal: '0,00 €'
	},
	purchase: {
		title: 'Compras Avanzadas',
		partyLabel: 'PROVEEDOR',
		primaryAction: 'Registrar Compra',
		documentNumber: 'COM-2026-0001',
		topTotal: '0,00 €'
	}
};

/**
 * Gets customized copy based on document type code.
 */
export function getDocumentTypeCopy(
	operation: DocumentOperation,
	typeCode: string | undefined,
	baseCopy: DocumentCreateCopy
): DocumentCreateCopy {
	if (!typeCode) return baseCopy;

	const labels: Record<string, string> = {
		'INV': 'Emitir Factura',
		'PINV': 'Registrar Factura',
		'DLV': 'Emitir Albarán',
		'PDLV': 'Registrar Albarán',
		'QUO': 'Emitir Presupuesto',
		'PQUO': 'Registrar Presupuesto',
		'PORD': 'Registrar Pedido',
	};

	const action = labels[typeCode];
	if (action) {
		return { ...baseCopy, primaryAction: action };
	}

	return baseCopy;
}

export const GRID_THEME_OPTIONS: DocumentGridThemeOption[] = [
	{ value: 'material', label: 'Material' },
	{ value: 'quartz', label: 'Quartz' },
	{ value: 'alpine', label: 'Alpine' },
	{ value: 'balham', label: 'Balham' }
];

export function makeEmptyLine(index: number): DocumentLineItem {
	return {
		id: String(index + 1).padStart(2, '0'),
		item_id: undefined,
		code: '',
		description: '',
		quantity: '1',
		unitPrice: '0',
		discount: '0',
		taxes: [],
		subtotal: '0.00',
	};
}

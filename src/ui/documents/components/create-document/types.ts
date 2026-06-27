export type DocumentOperation = 'sale' | 'purchase';
export type DocumentGridTheme = 'material' | 'quartz' | 'alpine' | 'balham';

export interface DocumentCreateCopy {
	title: string;
	partyLabel: string;
	primaryAction: string;
	documentNumber: string;
	topTotal: string;
	nextStatus?: string;
}

export interface DocumentLineTaxItem {
	id: number;
	name: string;
	rate: number;
	tax_type_id: number;
	tax_type_code?: string;
	operation: 'add' | 'subtract';
}

export interface DocumentLineItem {
	id: string;
	item_id?: number;
	store_id?: number;
	code: string;
	description: string;
	quantity: string;
	unit_name?: string;
	unitPrice: string;
	discount: string;
	taxes: DocumentLineTaxItem[];
	subtotal: string;
	source_document_id?: string;
	source_document_number?: string;
	has_serials?: boolean;
	has_batches?: boolean;
	procurement_type?: 'buy' | 'make';
	serial_numbers?: string[];
	is_serialization_resolved?: boolean;
	available_serial_numbers?: string[];
}

export interface DocumentFooterTotals {
	taxBase: string;
	taxAmount: string;
	withholding: string;
	surcharge: string;
	netPayable: string;
	hasSurcharge: boolean;
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
	is_associated?: boolean;
	unit?: {
		id: number;
		code: string;
		name: string;
	} | null;
	tax_rates: DocumentLineTaxItem[];
	physical_profile?: {
		barcode?: string;
		weight?: number;
		is_inventoriable?: boolean;
		has_batches?: boolean;
		has_serials?: boolean;
		stock_min?: number;
		has_stock_alert?: boolean;
		procurement_type?: 'buy' | 'make';
	} | null;
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
		'QUO': 'Aprobar Presupuesto',
		'PQUO': 'Aprobar Presupuesto',
		'PORD': 'Registrar Pedido',
	};

	const action = labels[typeCode];
	const statuses: Record<string, string> = {
		'DLV': 'delivered',
		'PDLV': 'received',
		'QUO': 'approved',
		'PQUO': 'approved',
	};

	const nextStatus = statuses[typeCode];

	if (action || nextStatus) {
		return { 
			...baseCopy, 
			primaryAction: action || baseCopy.primaryAction,
			nextStatus: nextStatus || baseCopy.nextStatus
		};
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
		unit_name: undefined,
		unitPrice: '0',
		discount: '0',
		taxes: [],
		subtotal: '0.00',
	};
}

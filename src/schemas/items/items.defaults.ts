import { ItemFormType } from './items.schema';

export const defaultCreateItemValues = {
	sku: '',
	name: '',
	type: 'physical',
	unit_id: '',
	category_id: '',
	family_id: '',
	subcategory_id: '',
	sale_price: 0,
	purchase_price: 0,
	description: '',
	is_active: true,
	tax_rate_ids: [],
	image: null,
	store_id: '',
	partner_ids: [],
	// Product tracking defaults
	barcode: '',
	weight: 0,
	dimension_length: undefined,
	dimension_width: undefined,
	dimension_height: undefined,
	dimension_unit: 'cm',
	is_inventoriable: true,
	has_batches: false,
	quantity: 0,
	estimated_time: undefined,
	req_scheduling: false,
	procurement_type: 'buy'
} as unknown as ItemFormType;

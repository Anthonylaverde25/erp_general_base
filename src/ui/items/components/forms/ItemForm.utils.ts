import { ItemFormType } from '@/schemas/items/items.schema';
import { CreateItemDTO } from '@/domain/entities/items/DTOs/ItemDTOs';

const buildDimensions = (values: ItemFormType): Record<string, unknown> | undefined => {
	const hasAnyDimension =
		values.dimension_length !== undefined ||
		values.dimension_width !== undefined ||
		values.dimension_height !== undefined;

	if (!hasAnyDimension) {
		return undefined;
	}

	return {
		length: values.dimension_length ?? 0,
		width: values.dimension_width ?? 0,
		height: values.dimension_height ?? 0,
		unit: values.dimension_unit || 'cm'
	};
};

export const mapItemFormToDTO = (values: ItemFormType): CreateItemDTO => {
	const initialStock =
		values.quantity !== undefined
			? Number(values.quantity)
			: values.initial_stock !== undefined
				? Number(values.initial_stock)
				: undefined;

	const baseDTO: CreateItemDTO = {
		sku: values.sku,
		name: values.name,
		type: values.type,
		unit_id: values.unit_id ? Number(values.unit_id) : undefined,
		category_id: values.category_id ? Number(values.category_id) : undefined,
		family_id: values.family_id ? Number(values.family_id) : undefined,
		subcategory_id: values.subcategory_id ? Number(values.subcategory_id) : undefined,
		sale_price: Number(values.sale_price),
		purchase_price: values.purchase_price ? Number(values.purchase_price) : undefined,
		description: values.description,
		is_active: values.is_active ?? true,
		tax_rate_ids: values.tax_rate_ids,
		image: values.image,
		store_id: values.store_id ? Number(values.store_id) : undefined,
		initial_stock: initialStock,
		quantity: initialStock,
		default_supplier_id: values.default_supplier_id ? Number(values.default_supplier_id) : undefined
	};

	if (values.type === 'physical') {
		return {
			...baseDTO,
			physical_profile: {
				barcode: values.barcode || undefined,
				weight: values.weight !== undefined ? Number(values.weight) : undefined,
				dimensions: buildDimensions(values),
				is_inventoriable:
					typeof values.is_inventoriable !== 'undefined' ? Boolean(values.is_inventoriable) : undefined
			}
		};
	}

	return {
		...baseDTO,
		service_profile: {
			estimated_time: values.estimated_time !== undefined ? Number(values.estimated_time) : undefined,
			req_scheduling: typeof values.req_scheduling !== 'undefined' ? Boolean(values.req_scheduling) : undefined
		}
	};
};

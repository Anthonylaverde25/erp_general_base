import { ItemFormType } from '@/schemas/items/items.schema';
import { CreateItemDTO, UpdateItemDTO } from '@/domain/entities/items/DTOs/ItemDTOs';
import { ItemEntity } from '@/domain/entities/items/ItemEntity';

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
		partner_ids: values.partner_ids?.map(Number).filter(Boolean)
	};

	if (values.type === 'physical') {
		return {
			...baseDTO,
			physical_profile: {
				barcode: values.barcode || undefined,
				weight: values.weight !== undefined ? Number(values.weight) : undefined,
				dimensions: buildDimensions(values),
				is_inventoriable:
					typeof values.is_inventoriable !== 'undefined' ? Boolean(values.is_inventoriable) : undefined,
				stock_min: values.stock_min !== undefined && values.stock_min !== null ? Number(values.stock_min) : undefined,
				has_stock_alert: typeof values.has_stock_alert !== 'undefined' ? Boolean(values.has_stock_alert) : undefined
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

export const mapItemFormToUpdateDTO = (values: ItemFormType): UpdateItemDTO => {
	const createPayload = mapItemFormToDTO(values);

	return {
		...createPayload
	};
};

export const mapItemToFormValues = (item: ItemEntity): ItemFormType => {
	const dimensions = item.physical_profile?.dimensions as
		| { length?: number; width?: number; height?: number; unit?: string }
		| undefined;

	return {
		sku: item.sku,
		name: item.name,
		type: item.type,
		unit_id: item.unit_id ? String(item.unit_id) : '',
		category_id: item.category_id ? String(item.category_id) : '',
		family_id: item.family_id ? String(item.family_id) : '',
		subcategory_id: item.subcategory_id ? String(item.subcategory_id) : '',
		sale_price: item.sale_price ?? 0,
		purchase_price: item.purchase_price ?? 0,
		description: item.description ?? '',
		is_active: item.is_active ?? true,
		tax_rate_ids: item.tax_rates?.map((taxRate) => taxRate.id) ?? [],
		image: null,
		partner_ids: item.partner_id != null ? [String(item.partner_id)] : [],
		barcode: item.physical_profile?.barcode ?? '',
		weight: item.physical_profile?.weight ?? 0,
		dimension_length: dimensions?.length,
		dimension_width: dimensions?.width,
		dimension_height: dimensions?.height,
		dimension_unit: dimensions?.unit ?? 'cm',
		is_inventoriable: item.physical_profile?.is_inventoriable ?? true,
		stock_min: item.physical_profile?.stock_min ?? null,
		has_stock_alert: item.physical_profile?.has_stock_alert ?? false,
		initial_stock: item.inventory?.[0]?.quantity_on_hand !== undefined ? item.inventory[0].quantity_on_hand : undefined,
		quantity: undefined,
		store_id: item.inventory?.[0]?.store_id ? String(item.inventory[0].store_id) : (item.store_id != null ? String(item.store_id) : ''),
		estimated_time: item.service_profile?.estimated_time,
		req_scheduling: item.service_profile?.req_scheduling ?? false
	} as ItemFormType;
};

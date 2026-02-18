import { ItemFormType } from '@/schemas/items/items.schema';
import { CreateItemDTO } from '@/domain/entities/items/DTOs/ItemDTOs';

export const mapItemFormToDTO = (values: ItemFormType): CreateItemDTO => {
    return {
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
        image: values.image
    };
};

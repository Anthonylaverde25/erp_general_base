import { ItemFormType } from './items.schema';

export const defaultCreateItemValues: ItemFormType = {
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
    image: null
};

import { CreateItemDTO, UpdateItemDTO } from '@/domain/entities/items/DTOs/ItemDTOs';
import { CreateItemWriteData, UpdateItemWriteData } from '@/domain/entities/items/ItemEntity';

export class ItemWriteMapper {
	// Mappers para transformar la estrcutura de los datos de escritura (guardar y actualizasr) a la estructura de los DTOs que se envían a la API
	static toCreateDTO(data: CreateItemWriteData): CreateItemDTO {
		return {
			sku: data.sku,
			name: data.name,
			type: data.type,
			unit_id: data.unitId,
			category_id: data.categoryId,
			family_id: data.familyId,
			subcategory_id: data.subcategoryId,
			sale_price: data.salePrice,
			purchase_price: data.purchasePrice,
			is_active: data.isActive,
			description: data.description,
			tax_rate_ids: data.taxRateIds,
			image: data.image,
			store_id: data.storeId,
			initial_stock: data.initialStock,
			quantity: data.quantity,
			partner_ids: data.partnerIds,
			physical_profile: data.physicalProfile,
			service_profile: data.serviceProfile
		};
	}

	static toUpdateDTO(data: UpdateItemWriteData): UpdateItemDTO {
		return {
			sku: data.sku,
			name: data.name,
			type: data.type,
			unit_id: data.unitId,
			category_id: data.categoryId,
			family_id: data.familyId,
			subcategory_id: data.subcategoryId,
			sale_price: data.salePrice,
			purchase_price: data.purchasePrice,
			is_active: data.isActive,
			description: data.description,
			tax_rate_ids: data.taxRateIds,
			image: data.image,
			store_id: data.storeId,
			partner_ids: data.partnerIds,
			physical_profile: data.physicalProfile,
			service_profile: data.serviceProfile
		};
	}
}

import { StoreEntity } from "../StoreEntity";

export class StoreMapper {
    static fromDetailDTO(data: any): StoreEntity {
        return StoreEntity.fromPrimitives({
            id: data.id,
            company_id: data.company_id,
            name: data.name,
            code: data.code,
            is_active: data.is_active,
            address: data.address, // Assuming API returns nested address object matching interface
        });
    }

    static fromDetailDTOList(data: any[]): StoreEntity[] {
        return data.map((item) => StoreMapper.fromDetailDTO(item));
    }
}

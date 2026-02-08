import { CompanySettingEntity } from "../CompanySettingEntity";
import { CompanySettingDTO } from "../DTOs/CompanySettingDTO";

export class CompanySettingMapper {
    static fromDTO(dto: CompanySettingDTO): CompanySettingEntity {
        return new CompanySettingEntity({
            id: dto.id,
            maxUsers: dto.max_users,
            maxStorageMb: dto.max_storage_mb,
            currency: dto.currency,
            timezone: dto.time_zone
        });
    }

    static fromDTOList(dtos: CompanySettingDTO[]): CompanySettingEntity[] {
        return dtos.map((dto) => this.fromDTO(dto));
    }
}

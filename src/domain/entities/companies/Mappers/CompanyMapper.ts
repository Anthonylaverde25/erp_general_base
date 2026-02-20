import { CompanyEntity } from "../Company";
import { ICompany } from "@/types/company.types";

export class CompanyMapper {
    static fromDetailDTO(dto: ICompany): CompanyEntity {
        const normalizedSettings = dto.settings ?? (dto as any).company_setting;

        return new CompanyEntity({
            id: dto.id,
            name: dto.name,
            cif: dto.cif,
            addresses: dto.addresses,
            contacts: dto.contacts,
            // contacts: dto.contacts?.map(contact => ContactMapper.fromDetailDTO(contact)),
            brandColor: dto.brandColor,
            max_users: dto.max_users,
            website: dto.website,
            logo_url: dto.logo_url,
            favicon_url: dto.favicon_url,
            settings: normalizedSettings
        });
    }

    static fromDetailDTOList(dto: ICompany[]): CompanyEntity[] {
        return dto.map((company) => CompanyMapper.fromDetailDTO(company));
    }

    static toCompanyType(company: CompanyEntity): ICompany {
        return company.toPlainObject();
    }
}

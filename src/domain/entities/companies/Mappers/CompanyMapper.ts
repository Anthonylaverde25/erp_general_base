import { Company } from '../Company';
import { Company as ICompany } from '@/types/company.types';

export class CompanyMapper {
    static fromDetailDTO(dto: ICompany): Company {
        return new Company({
            ...dto,
            brandColor: (dto as any).brand_color || dto.brandColor // Handle both cases just in case
        });
    }

    static fromDetailDTOList(dto: ICompany[]): Company[] {
        return dto.map((item) => this.fromDetailDTO(item));
    }

    static toCompanyType(company: Company): ICompany {
        return company.toPlainObject();
    }
}

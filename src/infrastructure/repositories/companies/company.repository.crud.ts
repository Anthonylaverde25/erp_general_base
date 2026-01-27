import { injectable } from 'inversify';
import axiosInstance from '@/lib/@axios';
import { ICompanyCrudRepository } from '@/domain/entities/companies/repositories/company.interface.crud';
import { Company } from '@/domain/entities/companies/Company';
import { CompanyMapper } from '@/domain/entities/companies/Mappers/CompanyMapper';

@injectable()
export class CompanyRepositoryCrud implements ICompanyCrudRepository {
    async index(): Promise<Company[]> {
        const {
            data: { companies }
        } = await axiosInstance.get(`companies`);
        return CompanyMapper.fromDetailDTOList(companies);
    }

    async show(id: number): Promise<Company> {
        const {
            data: { company }
        } = await axiosInstance.get(`companies/${id}`);
        return CompanyMapper.fromDetailDTO(company);
    }
}

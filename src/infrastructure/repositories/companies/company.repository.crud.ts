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

    async update(id: number, data: Company): Promise<{ company: Company; message: string }> {
        const payload = data.toPlainObject();
        const {
            data: { company, message },
        } = await axiosInstance.put(`/companies/${id}`, payload);

        return {
            company: CompanyMapper.fromDetailDTO(company),
            message: message || "Empresa actualizada correctamente",
        };
    }
}

import { injectable } from 'inversify';
import axiosInstance from '@/lib/@axios';
import { ICompanyActionRepository } from '@/domain/entities/companies/repositories/company.interface.action';
import { Company } from '@/types/company.types';

@injectable()
export class CompanyRepositoryAction implements ICompanyActionRepository {
    async changeCompany(id: Company['id']): Promise<string> {
        const { data: { message } } = await axiosInstance.post('companies/change-active-company', { companyId: id });
        return message;
    }
}

import { injectable } from 'inversify';
import axiosInstance from '@/lib/@axios';
import { ICompanyActionRepository } from '@/domain/entities/companies/repositories/company.interface.action';
import { Company } from '@/types/company.types';

@injectable()
export class CompanyRepositoryAction implements ICompanyActionRepository {
    async changeCompany(id: Company['id']): Promise<void> {
        const response = await axiosInstance.post('companies/active', { company_id: id });
        console.log('respuesta al cambiar de empresa', response);
    }
}

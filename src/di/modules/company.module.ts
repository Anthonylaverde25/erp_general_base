import { Container } from 'inversify';
import { TYPES } from '../types';
import { ICompanyCrudRepository } from '@/domain/entities/companies/repositories/company.interface.crud';
import { CompanyRepositoryCrud } from '@/infrastructure/repositories/companies/company.repository.crud';
import { IndexCompanyUseCase } from '@/application/use_cases/company/IndexCompanyUseCase';

export const registerCompanyModule = (container: Container) => {
    // Repositories
    container.bind<ICompanyCrudRepository>(TYPES.ICompanyCrudRepository).to(CompanyRepositoryCrud);

    // Use Cases
    container.bind<IndexCompanyUseCase>(TYPES.IndexCompanyUseCase).to(IndexCompanyUseCase);
};

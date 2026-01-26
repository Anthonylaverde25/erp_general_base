import { Container } from 'inversify';
import { TYPES } from '../types';
import { ICompanyCrudRepository } from '@/domain/entities/companies/repositories/company.interface.crud';
import { CompanyRepositoryCrud } from '@/infrastructure/repositories/companies/company.repository.crud';
import { IndexCompanyUseCase } from '@/application/use_cases/company/IndexCompanyUseCase';
import { ChangeCompanyUseCase } from '@/application/use_cases/company/ChangeCompanyUseCase';

import { ICompanyActionRepository } from '@/domain/entities/companies/repositories/company.interface.action';
import { CompanyRepositoryAction } from '@/infrastructure/repositories/companies/company.repository.action';

export const registerCompanyModule = (container: Container) => {
    // Repositories
    container.bind<ICompanyCrudRepository>(TYPES.ICompanyCrudRepository).to(CompanyRepositoryCrud);
    container.bind<ICompanyActionRepository>(TYPES.ICompanyActionRepository).to(CompanyRepositoryAction);

    // Use Cases
    container.bind<IndexCompanyUseCase>(TYPES.IndexCompanyUseCase).to(IndexCompanyUseCase);
    container.bind<ChangeCompanyUseCase>(TYPES.ChangeCompanyUseCase).to(ChangeCompanyUseCase);
};

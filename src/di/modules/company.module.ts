import { Container } from 'inversify';
import { TYPES } from '../types';
import { ICompanyCrudRepository } from '@/domain/entities/companies/repositories/company.interface.crud';
import { CompanyRepositoryCrud } from '@/infrastructure/repositories/companies/company.repository.crud';
import { IndexCompanyUseCase } from '@/application/use_cases/company/IndexCompanyUseCase';
import { ShowCompanyUseCase } from '@/application/use_cases/company/ShowCompanyUseCase';
import { ChangeCompanyUseCase } from '@/application/use_cases/company/ChangeCompanyUseCase';
import { UpdateCompanyUseCase } from '@/application/use_cases/company/UpdateCompanyUseCase';

import { ICompanyActionRepository } from '@/domain/entities/companies/repositories/company.interface.action';
import { CompanyRepositoryAction } from '@/infrastructure/repositories/companies/company.repository.action';

export const registerCompanyModule = (container: Container) => {
    // Repositories
    container.bind<ICompanyCrudRepository>(TYPES.ICompanyCrudRepository).to(CompanyRepositoryCrud);
    container.bind<ICompanyActionRepository>(TYPES.ICompanyActionRepository).to(CompanyRepositoryAction);

    // Use Cases
    container.bind<IndexCompanyUseCase>(TYPES.IndexCompanyUseCase).to(IndexCompanyUseCase);
    container.bind<ShowCompanyUseCase>(TYPES.ShowCompanyUseCase).to(ShowCompanyUseCase);
    container.bind<ChangeCompanyUseCase>(TYPES.ChangeCompanyUseCase).to(ChangeCompanyUseCase);
    container.bind<UpdateCompanyUseCase>(TYPES.UpdateCompanyUseCase).to(UpdateCompanyUseCase);
};

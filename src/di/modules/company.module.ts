import { Container } from 'inversify';
import { TYPES } from '../types';
import { ICompanyCrudRepository } from '@/domain/entities/companies/repositories/company.interface.crud';
import { CompanyRepositoryCrud } from '@/infrastructure/repositories/companies/CompanyRepositoryCrud';
import { IndexCompanyUseCase } from '@/application/use_cases/companies/IndexCompanyUseCase';
import { ShowCompanyUseCase } from '@/application/use_cases/companies/ShowCompanyUseCase';
import { ChangeCompanyUseCase } from '@/application/use_cases/companies/ChangeCompanyUseCase';
import { UpdateCompanyUseCase } from '@/application/use_cases/companies/UpdateCompanyUseCase';

import { ChangeDefaultAddressUseCase } from '@/application/use_cases/companies/ChangeDefaultAddressUseCase';
import { ChangeDefaultContactUseCase } from '@/application/use_cases/companies/ChangeDefaultContactUseCase';
import { ICompanyActionRepository } from '@/domain/entities/companies/repositories/company.interface.action';
import { CompanyRepositoryAction } from '@/infrastructure/repositories/companies/CompanyRepositoryAction';

export const registerCompanyModule = (container: Container) => {
	// Repositories
	container.bind<ICompanyCrudRepository>(TYPES.ICompanyCrudRepository).to(CompanyRepositoryCrud);
	container.bind<ICompanyActionRepository>(TYPES.ICompanyActionRepository).to(CompanyRepositoryAction);

	// Use Cases
	container.bind<IndexCompanyUseCase>(TYPES.IndexCompanyUseCase).to(IndexCompanyUseCase);
	container.bind<ShowCompanyUseCase>(TYPES.ShowCompanyUseCase).to(ShowCompanyUseCase);
	container.bind<ChangeCompanyUseCase>(TYPES.ChangeCompanyUseCase).to(ChangeCompanyUseCase);
	container.bind<UpdateCompanyUseCase>(TYPES.UpdateCompanyUseCase).to(UpdateCompanyUseCase);
	// container.bind<CreateAddressUseCase>(TYPES.CreateAddressUseCase).to(CreateAddressUseCase);
	container.bind<ChangeDefaultAddressUseCase>(TYPES.ChangeDefaultAddressUseCase).to(ChangeDefaultAddressUseCase);
	container.bind<ChangeDefaultContactUseCase>(TYPES.ChangeDefaultContactUseCase).to(ChangeDefaultContactUseCase);
};

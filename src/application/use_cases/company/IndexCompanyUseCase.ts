import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCaseNoInput } from '../IUseCase';
import { Company } from '@/domain/entities/companies/Company';
import type { ICompanyCrudRepository } from '@/domain/entities/companies/repositories/company.interface.crud';

@injectable()
export class IndexCompanyUseCase implements IUseCaseNoInput<Company[]> {
    constructor(
        @inject(TYPES.ICompanyCrudRepository)
        private readonly repository: ICompanyCrudRepository
    ) { }

    async execute(): Promise<Company[]> {
        return await this.repository.index();
    }
}

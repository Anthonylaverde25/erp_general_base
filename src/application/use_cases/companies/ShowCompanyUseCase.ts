import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '../IUseCase';
import { CompanyEntity } from '@/domain/entities/companies/Company';
import type { ICompanyCrudRepository } from '@/domain/entities/companies/repositories/company.interface.crud';

@injectable()
export class ShowCompanyUseCase implements IUseCase<number, CompanyEntity> {
    constructor(
        @inject(TYPES.ICompanyCrudRepository)
        private readonly repository: ICompanyCrudRepository
    ) { }

    async execute(id: number): Promise<CompanyEntity> {
        return await this.repository.show(id);
    }
}

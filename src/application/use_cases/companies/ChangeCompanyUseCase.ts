import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '../IUseCase';
import { CompanyEntity } from '@/domain/entities/companies/Company';
import type { ICompanyActionRepository } from '@/domain/entities/companies/repositories/company.interface.action';

@injectable()
export class ChangeCompanyUseCase implements IUseCase<CompanyEntity['id'], string> {
    constructor(
        @inject(TYPES.ICompanyActionRepository)
        private readonly repository: ICompanyActionRepository
    ) { }

    async execute(id: CompanyEntity['id']): Promise<string> {
        return await this.repository.changeCompany(id);
    }
}

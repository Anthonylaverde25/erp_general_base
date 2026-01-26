import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCaseVoid } from '../IUseCase';
import { Company } from '@/domain/entities/companies/Company';
import type { ICompanyActionRepository } from '@/domain/entities/companies/repositories/company.interface.action';

@injectable()
export class ChangeCompanyUseCase implements IUseCaseVoid<Company['id']> {
    constructor(
        @inject(TYPES.ICompanyActionRepository)
        private readonly repository: ICompanyActionRepository
    ) { }

    async execute(id: Company['id']): Promise<void> {
        return await this.repository.changeCompany(id);
    }
}

import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '../IUseCase';
import { Company } from '@/domain/entities/companies/Company';
import type { ICompanyCrudRepository } from '@/domain/entities/companies/repositories/company.interface.crud';

export interface UpdateCompanyParams {
    id: number;
    data: Company;
}

@injectable()
export class UpdateCompanyUseCase implements IUseCase<UpdateCompanyParams, { company: Company; message: string }> {
    constructor(
        @inject(TYPES.ICompanyCrudRepository)
        private readonly repository: ICompanyCrudRepository
    ) { }

    async execute(params: UpdateCompanyParams): Promise<{ company: Company; message: string }> {
        return await this.repository.update(params.id, params.data);
    }
}

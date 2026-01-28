import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '../IUseCase';
import { UpdateCompanyDTO } from '@/domain/entities/companies/DTOs/UpdateCompanyDTO';

export interface UpdateCompanyParams {
    id: number;
    data: UpdateCompanyDTO;
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

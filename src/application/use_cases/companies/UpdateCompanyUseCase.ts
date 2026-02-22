import { inject, injectable } from 'inversify';
import { TYPES } from '@/di/types';
import { IUseCase } from '../IUseCase';
import { CompanyEntity } from '@/domain/entities/companies/Company';
import { UpdateCompanyDTO } from '@/domain/entities/companies/DTOs/UpdateCompanyDTO';
import type { ICompanyCrudRepository } from '@/domain/entities/companies/repositories/company.interface.crud';

export interface UpdateCompanyParams {
	id: number;
	data: UpdateCompanyDTO;
}

@injectable()
export class UpdateCompanyUseCase
	implements IUseCase<UpdateCompanyParams, { company: CompanyEntity; message: string }>
{
	constructor(
		@inject(TYPES.ICompanyCrudRepository)
		private readonly repository: ICompanyCrudRepository
	) {}

	async execute(params: UpdateCompanyParams): Promise<{ company: CompanyEntity; message: string }> {
		return await this.repository.update(params.id, params.data);
	}
}

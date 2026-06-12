import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import type { IEmployeeRepository } from '@/domain/entities/employees/repositories/employee.repository';
import { EmployeeEntity } from '@/domain/entities/employees/EmployeeEntity';

@injectable()
export class IndexEmployeesUseCase {
	constructor(
		@inject(TYPES.EmployeeRepository)
		private repository: IEmployeeRepository
	) {}

	async execute(search?: string): Promise<EmployeeEntity[]> {
		return await this.repository.index(search);
	}
}

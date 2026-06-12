import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import type { IEmployeeRepository } from '@/domain/entities/employees/repositories/employee.repository';

@injectable()
export class DeleteEmployeeUseCase {
	constructor(
		@inject(TYPES.EmployeeRepository)
		private repository: IEmployeeRepository
	) {}

	async execute(id: number): Promise<void> {
		return await this.repository.delete(id);
	}
}

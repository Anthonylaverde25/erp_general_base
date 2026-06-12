import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import type { IEmployeeRepository } from '@/domain/entities/employees/repositories/employee.repository';
import { CreateEmployeeDTO } from '@/domain/entities/employees/DTOs/EmployeeDTOs';
import { EmployeeEntity } from '@/domain/entities/employees/EmployeeEntity';

@injectable()
export class CreateEmployeeUseCase {
	constructor(
		@inject(TYPES.EmployeeRepository)
		private repository: IEmployeeRepository
	) {}

	async execute(data: CreateEmployeeDTO): Promise<{ employee: EmployeeEntity; message: string }> {
		const employee = EmployeeEntity.create(data);
		return await this.repository.create(employee);
	}
}

import { injectable, inject } from 'inversify';
import { TYPES } from '@/di/types';
import type { IEmployeeRepository } from '@/domain/entities/employees/repositories/employee.repository';
import { UpdateEmployeeDTO } from '@/domain/entities/employees/DTOs/EmployeeDTOs';
import { EmployeeEntity } from '@/domain/entities/employees/EmployeeEntity';

@injectable()
export class UpdateEmployeeUseCase {
	constructor(
		@inject(TYPES.EmployeeRepository)
		private repository: IEmployeeRepository
	) {}

	async execute(id: number, data: UpdateEmployeeDTO): Promise<{ employee: EmployeeEntity; message: string }> {
		const employee = EmployeeEntity.update(id, data);
		return await this.repository.update(id, employee);
	}
}

import { inject, injectable } from 'inversify';
import type { IDepartmentRepository } from '@/domain/repositories/IDepartmentRepository';
import { ICreateDepartment, IDepartment } from '@/types/department.types';
import { TYPES } from '@/di/types';

@injectable()
export class CreateDepartmentUseCase {
    constructor(
        @inject(TYPES.IDepartmentRepository) private departmentRepository: IDepartmentRepository
    ) { }

    async execute(data: ICreateDepartment): Promise<IDepartment> {
        return this.departmentRepository.create(data);
    }
}

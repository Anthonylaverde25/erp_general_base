import { inject, injectable } from 'inversify';
import type { IDepartmentRepository } from '@/domain/repositories/IDepartmentRepository';
import { IDepartment } from '@/types/department.types';
import { TYPES } from '@/di/types';

@injectable()
export class IndexDepartmentsUseCase {
    constructor(
        @inject(TYPES.IDepartmentRepository) private departmentRepository: IDepartmentRepository
    ) { }

    async execute(): Promise<IDepartment[]> {
        return this.departmentRepository.index();
    }
}

import { inject, injectable } from 'inversify';
import type { IDepartmentRepository } from '@/domain/repositories/IDepartmentRepository';
import { IDepartment } from '@/types/department.types';
import { TYPES } from '@/di/types';

@injectable()
export class ShowDepartmentUseCase {
    constructor(
        @inject(TYPES.IDepartmentRepository) private departmentRepository: IDepartmentRepository
    ) { }

    async execute(id: number): Promise<IDepartment> {
        return this.departmentRepository.show(id);
    }
}

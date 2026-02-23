import { inject, injectable } from 'inversify';
import type { IDepartmentRepository } from '@/domain/repositories/IDepartmentRepository';
import { IUpdateDepartment, IDepartment } from '@/types/department.types';
import { TYPES } from '@/di/types';

@injectable()
export class UpdateDepartmentUseCase {
    constructor(
        @inject(TYPES.IDepartmentRepository) private departmentRepository: IDepartmentRepository
    ) { }

    async execute(id: number, data: IUpdateDepartment): Promise<IDepartment> {
        return this.departmentRepository.update(id, data);
    }
}

import { inject, injectable } from 'inversify';
import type { IDepartmentRepository } from '@/domain/repositories/IDepartmentRepository';
import { TYPES } from '@/di/types';

@injectable()
export class DeleteDepartmentUseCase {
    constructor(
        @inject(TYPES.IDepartmentRepository) private departmentRepository: IDepartmentRepository
    ) { }

    async execute(id: number): Promise<void> {
        return this.departmentRepository.destroy(id);
    }
}

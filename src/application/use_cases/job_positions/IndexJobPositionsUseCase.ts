import { inject, injectable } from 'inversify';
import type { IJobPositionRepository } from '@/domain/entities/job_positions/repositories/job_position.repository';
import { JobPositionEntity } from '@/domain/entities/job_positions/JobPositionEntity';
import { TYPES } from '@/di/types';

@injectable()
export class IndexJobPositionsUseCase {
	constructor(
		@inject(TYPES.JobPositionRepository) private repository: IJobPositionRepository
	) {}

	async execute(departmentId?: number | null): Promise<JobPositionEntity[]> {
		return this.repository.index(departmentId);
	}
}
